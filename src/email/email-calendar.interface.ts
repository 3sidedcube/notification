import { ICalEventStatus } from 'ical-generator';

export interface IEmailCalendar {
    prodId?: string;
    id?: string;
    title: string;
    description: string;
    summary: string;
    location: string;
    url?: string;
    start: Date;
    end: Date;
    organizer?: {
        name: string;
        mailTo: string;
    };
    fileName?: string;
    status?: ICalEventStatus;
}
