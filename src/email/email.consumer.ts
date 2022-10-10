import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { Job } from 'bull';
import * as NodeMailer from 'nodemailer';
import { NOTIFICATION_OPTIONS } from '../constants';
import { NotificationOptions } from '../interfaces';
import { IEmailPayload } from './email.interface';
import ical, { ICalCalendar } from 'ical-generator';
import Mail from 'nodemailer/lib/mailer';

@Processor('email')
export class EmailConsumer {
    private client?: NodeMailer.Transporter;

    constructor(@Inject(NOTIFICATION_OPTIONS) private options: NotificationOptions) {
        if (options.email.enabled === false) return;

        this.client = NodeMailer.createTransport({
            host: options.email.host,
            port: options.email.port,
            secure: +options.email.port === 465,
            auth: {
                user: options.email.user,
                pass: options.email.password,
            },
        });

        this.options.logger?.debug('Email consumer initalised', {
            host: options.email.host,
            port: options.email.port,
            secure: +options.email.port === 465,
        });
    }

    /**
     * Send an email to a set of addresses
     * @param to List of email addresses
     * @param from Email from field. Default provided
     * @param subject Email subject
     * @param body Email HTML body
     */
    @Process()
    async send({ data: { to, subject, body, from, replyTo, calendar } }: Job<IEmailPayload>): Promise<any> {
        if (this.options.email.enabled === false) return this.options.logger?.warn('Emails are disabled');

        this.options.logger?.debug('Email payload received', { to, subject, from, calendar });

        let calendarEvent: ICalCalendar | undefined;
        if (calendar) {
            calendarEvent = ical({ name: calendar.title, ...(calendar.prodId ? { prodId: calendar.prodId } : {}) });

            calendarEvent.createEvent({
                id: calendar.id,
                start: calendar.start,
                end: calendar.end,
                summary: calendar.summary,
                description: calendar.description,
                location: calendar.location,
                ...(calendar.url ? { url: calendar.url } : {}),
                ...(calendar.status ? { status: calendar.status } : {}),
                // ...(calendar.organizer
                //     ? {
                //           organizer: {
                //               name: calendar.organizer.name,
                //               mailto: calendar.organizer.mailTo,
                //           },
                //       }
                //     : {}),
            });

            this.options.logger?.debug('Calendar event added to email', {
                subject,
                from,
                calendar,
                calendarEvent,
            });
        }

        let calendarContent = calendarEvent?.toString();

        if (calendar?.organizer) {
            // Fix as bug with generation on organizer on generator package
            calendarContent = calendarContent?.replace(
                'END:VEVENT',
                `ORGANIZER;CN=${calendar.organizer.name}:MAILTO:${calendar.organizer.mailTo}\nEND:VEVENT`,
            );
        }

        let response: any = null;
        const payload: Mail.Options = {
            from,
            to,
            subject,
            replyTo,
            html: body,
            ...(calendarEvent && calendarContent
                ? {
                      icalEvent: {
                          filename: calendar?.fileName ?? 'invitation.ics',
                          method: 'request',
                          content: calendarContent,
                      },
                  }
                : {}),
        };
        try {
            response = await this.client?.sendMail(payload);
            this.options.logger?.info(`Email delivered [${subject}, ${to}]`, {
                payload: {
                    ...payload,
                    html: null,
                },
                response,
            });
        } catch (err) {
            // Failed to send email
            this.options.logger?.error('Failed to send email', {
                err,
                response,
                payload,
            });
        }
        return response;
    }
}
