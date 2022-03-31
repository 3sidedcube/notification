import { IEmailPayload } from '../email/email.interface';
import { INotificationUser } from '../interfaces';
import { IPushPayload } from '../push/push.interface';
import { ISMSPayload } from '../sms/sms.interface';

export interface ICustomPayload<T = Record<string, any>> {
    to: INotificationUser[];

    email?: IEmailPayload;

    push?: IPushPayload;

    sms?: ISMSPayload;

    data?: T;
}
