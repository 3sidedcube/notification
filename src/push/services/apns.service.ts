import { Inject, Injectable } from '@nestjs/common';
import { Notification, Provider } from '@parse/node-apn';
import { NOTIFICATION_OPTIONS } from '../../constants';
import { NotificationOptions } from '../../interfaces';
import { IPushPayload } from '../push.interface';
import { IPushService } from './service.interface';

@Injectable()
export class ApnsService implements IPushService {
    private provider?: Provider;

    constructor(@Inject(NOTIFICATION_OPTIONS) private options: NotificationOptions) {
        if (options.push.enabled === false || !options.push.apns) return;

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
    }

    async send(to: string[], { alert, options, payload }: Omit<IPushPayload, 'to'>): Promise<void> {
        if (this.options.push.enabled === false || !this.options.push.apns) {
            this.options.logger?.warn('APNS Push notifications are disabled');
            return;
        }

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
            this.options.logger?.info(`APNS Push notifications delivered [${options.category}]`, {
                res,
                notification,
            });
        } catch (err) {
            // Failed to send SMS
            this.options.logger?.error('Failed to send APNS push notification', err);
        }
    }
}
