import { ApsSound } from '@parse/node-apn';

export interface IPushNotificationOptions {
    /**
     * Notification category
     */
    category: string;
    /**
     * Expiry time (milliseconds)
     */
    expiry?: number;
    /**
     * The number to display in a badge on your app’s icon.
     * Specify 0 to remove the current badge, if any.
     */
    badge?: number;
    /**
     * The name of a sound file in your app’s main bundle or in the `Library/Sounds` folder of your app’s container directory, or
     * a dictionary that contains sound information for critical alerts.
     * Specify the string "default" to play the system sound.
     * Use the string name for regular notifications. For critical alerts, use the sound dictionary instead
     */
    sound?: string | ApsSound;
}

export interface IPushPayload {
    /**
     * List of device tokens
     */
    to: string[];

    /**
     * Alert details
     */
    alert: {
        /**
         * Alert title
         */
        title?: string;
        /**
         * Alert subtitle
         */
        subtitle?: string;
        /**
         * Alert body
         */
        body: string;
    };

    options: IPushNotificationOptions;

    payload?: Record<string, any>;
}
