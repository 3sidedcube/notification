import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import { IPushPayload } from './push.interface';
import { NOTIFICATION_OPTIONS } from '../constants';
import { NotificationOptions } from '../interfaces';
import { ApnsService } from './services/apns.service';
import { FcmService } from './services/fcm.service';

@Processor('push')
export class PushConsumer {
    constructor(
        @Inject(NOTIFICATION_OPTIONS) private options: NotificationOptions,
        private readonly apnsService: ApnsService,
        private readonly fcmService: FcmService,
    ) {
        if (options.push.enabled === false) return;

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
    async send({ data: { to, ...payload } }: Job<IPushPayload>): Promise<any> {
        let iosDevices = to.filter((device) => device.type === 'IOS').map((device) => device.token);
        let androidDevices = to.filter((device) => device.type === 'ANDROID').map((device) => device.token);
        this.options.logger?.debug('Devices', { iosDevices, androidDevices });

        if (iosDevices.length > 0) await this.apnsService.send(iosDevices, payload);

        if (androidDevices.length > 0) await this.fcmService.send(androidDevices, payload);
    }
}
