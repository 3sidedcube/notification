// tslint:disable: variable-name
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Injectable, Inject } from '@nestjs/common';
import { NOTIFICATION_OPTIONS } from './constants';
import { INotificationUser, NotificationOptions } from './interfaces';
import { INotification, NotificationMethod } from './interfaces/notification.interface';
import { ISMSPayload } from './sms/sms.interface';
import { IEmailPayload } from './email/email.interface';
import { IPushPayload } from './push/push.interface';
import { ICustomPayload } from './custom/custom.interface';

interface INotificationService {
    send(notification: INotification): Promise<void>;
}

@Injectable()
export class NotificationService implements INotificationService {
    constructor(
        @Inject(NOTIFICATION_OPTIONS)
        private _NotificationOptions: NotificationOptions,
        @InjectQueue('email') private emailQueue: Queue,
        @InjectQueue('sms') private smsQueue: Queue,
        @InjectQueue('push') private pushQueue: Queue,
        @InjectQueue('custom') private customQueue: Queue,
    ) {}

    /**
     * Send a notification to a set of users
     * @param notification Notification object
     */
    async send(notification: INotification): Promise<void> {
        if (notification.methods.length === 0) throw new Error('No notification methods specified');

        let to: INotificationUser[] = [];
        to = to.concat(notification.to);
        to = to.filter((to) => to);

        if (to.length === 0) return;

        this._NotificationOptions.logger?.info(
            `Notification recieved [${notification.methods.map((method) => NotificationMethod[method]).join(', ')}]`,
            {
                notification: {
                    ...notification,
                    template: null,
                    body: null,
                    emailBody: null,
                    to: null,
                },
                to: to.map((to) => ({
                    deviceToken: to.deviceToken,
                    email: to.email,
                    phone: to.phone,
                })),
            },
        );

        // Send email if enabled
        if (
            this.isMethodEnabled(notification, NotificationMethod.Email) &&
            this._NotificationOptions.email.enabled !== false
        ) {
            if (
                !this.isTextGiven(notification.subject) ||
                (!this.isTextGiven(notification.body) && !this.isTextGiven(notification.emailBody))
            ) {
                throw new Error('No notification subject/body given');
            }

            const payload = this.buildEmailPayload(to, notification, this._NotificationOptions.email.from);

            this._NotificationOptions.logger?.debug('Sending email', {
                payload: {
                    ...payload,
                    body: null,
                },
            });

            // Add to queue to be sent
            await this.emailQueue.add(payload);
        }

        // Send push notification if enabled
        if (
            this.isMethodEnabled(notification, NotificationMethod.Push) &&
            this._NotificationOptions.push.enabled !== false
        ) {
            if (
                !this.isTextGiven(notification.subject) ||
                (!this.isTextGiven(notification.body) && !this.isTextGiven(notification.pushBody))
            ) {
                throw new Error('No notification subject/body given');
            }
            if (!this.isTextGiven(notification.pushOptions?.category)) {
                throw new Error('No notification category given');
            }

            const payload = this.buildPushPayload(to, notification);

            this._NotificationOptions.logger?.debug('Sending push notification', {
                payload,
            });

            // Add to push queue to be sent
            await this.pushQueue.add(payload);
        }

        // Send SMS notification if enabled
        if (
            this.isMethodEnabled(notification, NotificationMethod.SMS) &&
            this._NotificationOptions.sms.enabled !== false
        ) {
            if (!this.isTextGiven(notification.body) && !this.isTextGiven(notification.smsBody)) {
                throw new Error('No notification body given');
            }

            const payload = this.buildSmsPayload(to, notification);

            this._NotificationOptions.logger?.debug('Sending SMS', {
                payload,
            });

            // Add to queue to be sent
            await this.smsQueue.add(payload);
        }

        // Forward notification to any custom handlers, only if explicitly enabled
        if (
            this.isMethodEnabled(notification, NotificationMethod.Custom) &&
            this._NotificationOptions.custom.enabled === true
        ) {
            const payload: ICustomPayload = {
                email: this.buildEmailPayload(to, notification),
                push: this.buildPushPayload(to, notification),
                sms: this.buildSmsPayload(to, notification),
                data: notification.data,
            };

            this._NotificationOptions.logger?.debug('Sending to custom handler', {
                payload,
            });

            await this.customQueue.add(payload);
        }
    }

    private isMethodEnabled(notification: INotification, method: NotificationMethod) {
        return notification.methods.includes(NotificationMethod.Email);
    }

    private isTextGiven(text?: string | null): boolean {
        return !!(text && text.trim().length > 0);
    }

    /**
     * Build email consumer payload
     * @param to Users to send to
     * @param notification Notification payload
     * @param from From email, if applicable
     * @returns Payload object
     */
    private buildEmailPayload(to: INotificationUser[], notification: INotification, from?: string): IEmailPayload {
        const emailAddresses = to.map((user) => user.email).filter((email) => email) as string[];

        // Format queue payload
        return {
            to: emailAddresses,
            subject: notification.subject!,
            body: notification.emailBody ?? notification.body ?? '',
            from: notification.from ?? from,
            calendar: notification.calendar,
        };
    }

    /**
     * Build push consumer payload
     * @param to Users to send to
     * @param notification Notification payload
     * @returns Payload object
     */
    private buildPushPayload(to: INotificationUser[], notification: INotification): IPushPayload {
        const deviceTokens = to.map((user) => user?.deviceToken).filter((token) => token) as string[];

        return {
            to: deviceTokens,
            alert: {
                title: notification.subject,
                subtitle: notification.subtitle,
                body: notification.pushBody ?? notification.body ?? '',
            },
            options: notification.pushOptions!,
            payload: notification.pushPayload,
        };
    }

    /**
     * Build SMS consumer payload
     * @param to Users to send to
     * @param notification Notification payload
     * @returns Payload object
     */
    private buildSmsPayload(to: INotificationUser[], notification: INotification): ISMSPayload {
        const mobileNumbers = to.map((user) => user.phone).filter((phone) => phone) as string[];

        return {
            to: mobileNumbers,
            message: notification.smsBody ?? notification.body ?? '',
        };
    }
}
