import { IEmailPayload } from '../email/email.interface';
import { IPushPayload } from '../push/push.interface';
import { ISMSPayload } from '../sms/sms.interface';

export interface ICustomPayload<T = Record<string, any>> {
    email?: IEmailPayload;

    push?: IPushPayload;

    sms?: ISMSPayload;

    data?: T;
}
