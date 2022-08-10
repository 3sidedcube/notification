import { IPushPayload } from '../push.interface';

export interface IPushService {
    send(to: string[], payload: Omit<IPushPayload, 'to'>): Promise<void>;
}
