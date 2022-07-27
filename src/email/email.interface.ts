import { IEmailCalendar } from './email-calendar.interface';

export interface IEmailPayload {
    /**
     * Email addresses to send to
     */
    to: string[];
    /**
     * Email subject
     */
    subject: string;
    /**
     * Email HTML content
     */
    body: string;
    /**
     * Email from
     */
    from: string;
    /**
     * Email reply to address
     */
    replyTo?: string;
    /**
     * Optional calendar attachment
     */
    calendar?: IEmailCalendar;
}
