import { Logger } from 'winston';
import { IEmailOptions } from './email-options.interface';
import { IPushOptions } from './push-options.interface';
import { ISMSOptions } from './sms-options.interface';

// tslint:disable: no-empty-interface
export interface NotificationOptions {
    /**
     * Register the module globally? Default `true`
     */
    isGlobal?: boolean;
    /**
     * Winston compatible logger.
     * Default will be used if not provided.
     */
    logger?: Logger;
    /**
     * SMTP settings
     */
    email: IEmailOptions;
    /**
     * SMS configuration
     */
    sms: ISMSOptions;
    /**
     * Push notification configuration
     */
    push: IPushOptions;
}
