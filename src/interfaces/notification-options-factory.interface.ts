import { NotificationOptions } from './notification-options.interface';

export interface NotificationOptionsFactory {
    createNotificationOptions(): Promise<NotificationOptions> | NotificationOptions;
}
