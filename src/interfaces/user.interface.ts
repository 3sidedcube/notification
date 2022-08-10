import { IPushDevice } from '../push/push.interface';

export interface INotificationUser {
    /**
     * User's platform ID
     */
    id?: string;

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
    deviceToken?: IPushDevice;
}
