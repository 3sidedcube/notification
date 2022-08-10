import { Inject, Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { MessagingPayload } from 'firebase-admin/lib/messaging/messaging-api';
import { NOTIFICATION_OPTIONS } from '../../constants';
import { NotificationOptions } from '../../interfaces';
import { IPushPayload } from '../push.interface';
import { IPushService } from './service.interface';

@Injectable()
export class FcmService implements IPushService {
    private app: admin.app.App;

    constructor(@Inject(NOTIFICATION_OPTIONS) private options: NotificationOptions) {
        if (options.push.enabled === false || !options.push.fcm) return;

        this.app = admin.initializeApp({
            credential: admin.credential.cert({
                ...options.push.fcm,
                privateKey: options.push.fcm.privateKey.replace(/\\n/g, '\n'),
            }),
        });
    }

    async send(to: string[], { alert, options, payload }: Omit<IPushPayload, 'to'>): Promise<void> {
        if (this.options.push.enabled === false || !this.options.push.fcm) {
            this.options.logger?.warn('FCM Push notifications are disabled');
            return;
        }

        let body = alert.body;

        if (alert.subtitle?.length > 0 && this.options.push.placeSubtitleInBody) {
            body = `${alert.subtitle} | ${alert.body}`;
        }

        const notification: MessagingPayload = {
            notification: {
                body,
                title: alert.title,
                badge: !Number.isNaN(options.badge) ? String(options.badge) : undefined,
                sound: typeof options.sound === 'string' ? options.sound : options.sound.name,
            },
            data: {
                subtitle: alert.subtitle,
                ...payload,
            },
        };

        try {
            const res = await this.app.messaging().sendToDevice(to, notification);
            this.options.logger?.info(`FCM Push notifications delivered [${options.category}]`, {
                res,
                notification,
            });
        } catch (err) {
            this.options.logger?.error('Failed to send FCM push notification', err);
        }
    }
}
