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
        if (options.push.enabled === false) return;

        this.app = admin.initializeApp({
            credential: admin.credential.cert(options.push.fcm),
        });
    }

    async send(to: string[], { alert, options, payload }: Omit<IPushPayload, 'to'>): Promise<void> {
        const notification: MessagingPayload = {
            notification: {
                title: alert.title,
                body: alert.body,
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
