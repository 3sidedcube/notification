import { Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { IPushPayload } from './push.interface';
import { NOTIFICATION_OPTIONS } from '../constants';
import { NotificationOptions } from '../interfaces';
import { Notification, Provider } from '@parse/node-apn';

@Processor('push')
export class PushConsumer {
    private provider?: Provider;

    constructor(@Inject(NOTIFICATION_OPTIONS) private options: NotificationOptions) {
        if (options.push.enabled === false) return;

        this.provider = new Provider({
            production: options.push.production,
            requestTimeout: options.push.requestTimeout,
            connectionRetryLimit: options.push.connectionRetryLimit,
            rejectUnauthorized: options.push.rejectUnauthorized,
            token: {
                key: Buffer.from(options.push.apns.key, 'utf-8'),
                keyId: options.push.apns.keyID,
                teamId: options.push.apns.teamID,
            },
        });

        this.options.logger?.debug('Push consumer initalised', {
            production: options.push.production,
            topic: options.push.apns.topic,
            teamID: options.push.apns.teamID,
            keyID: options.push.apns.keyID,
        });
    }

    /**
     * Send a push notification to a set of devices
     * @param data Notification payload
     */
    @Process()
    async send({ data: { to, alert, options, payload } }: Job<IPushPayload>): Promise<any> {
        if (this.options.push.enabled === false) return this.options.logger?.warn('Push notifications are disabled');

        const notification = new Notification();
        notification.alert = alert;
        notification.topic = this.options.push.apns.topic;
        notification.badge = options.badge ?? 0;
        notification.expiry = options.expiry ?? 0;
        notification.sound = options.sound ?? 'default';
        notification.payload = {
            ...payload,
            category: options.category,
        };

        try {
            const res = await this.provider?.send(notification, to);
            this.options.logger?.info(`Push notifications delivered [${options.category}]`, {
                res,
                notification,
            });
        } catch (err) {
            // Failed to send SMS
            this.options.logger?.error('Failed to send push notification', err);
        }
    }
}
