import { IEmailCalendar } from '../email/email-calendar.interface';
import { IPushNotificationOptions } from '../push/push.interface';
import { INotificationUser } from './user.interface';

/**
 * Available notification delivery methods
 */
export enum NotificationMethod {
    /**
     * Send to user's email
     */
    Email = 'Email',
    /**
     * Send to user's device
     */
    Push = 'Push',
    /**
     * Send text to user's mobile
     */
    SMS = 'SMS',
    /**
     * Send text to custom notification handler
     */
    Custom = 'Custom',
}

/**
 * Notification object to send to user(s)
 */
export interface INotification<T = Record<string, any>> {
    /**
     * Delivery method(s) to use to send notification
     */
    methods: NotificationMethod[];

    /**
     * User or list of users to send to
     */
    to: INotificationUser | INotificationUser[];

    /**
     * Email sender (default used if not given)
     */
    from?: string;

    /**
     * Header item
     * @description This is used for the following:
     * - **Email**: Email subject
     * - **Push**: Push alert title
     * - **SMS**: *Not used*
     */
    subject?: string;

    /**
     * Subtitle
     * @description This is used for the following:
     * - **Email**: *Not used*
     * - **Push**: Push alert subtitle
     * - **SMS**: *Not used*
     */
    subtitle?: string;

    /**
     * Default notification content. Overriden by `emailBody` and `pushBody`.
     */
    body?: string;

    /**
     * Provide specific email content. Overrides `body`.
     */
    emailBody?: string;

    /**
     * Provide specific SMS content. Overrides `body`.
     */
    smsBody?: string;

    /**
     * Provide specific push content. Overrides `body`.
     */
    pushBody?: string;

    /**
     * Push notification payload
     */
    pushPayload?: Record<string, any>;

    /**
     * Push notification configuration
     */
    pushOptions?: IPushNotificationOptions;

    /**
     * Optional calendar attachment
     */
    calendar?: IEmailCalendar;

    data?: T;
}
