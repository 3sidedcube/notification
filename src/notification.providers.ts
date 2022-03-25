import { NotificationOptions } from './interfaces';

import { NOTIFICATION_OPTIONS } from './constants';
import { Provider } from '@nestjs/common';

export function createNotificationProviders(options: NotificationOptions): Provider[] {
    return [
        {
            provide: NOTIFICATION_OPTIONS,
            useValue: options,
        },
    ];
}
