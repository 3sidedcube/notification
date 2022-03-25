export interface INotificationUser {
    /**
     * User's email
     */
    email?: string;

    /**
     * User's phone
     */
    phone?: string;

    /**
     * User's push notification token
     */
    deviceToken?: string;
}
