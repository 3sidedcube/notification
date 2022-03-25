import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { Job } from 'bull';
import { ISMSPayload } from './sms.interface';
import { NOTIFICATION_OPTIONS } from '../constants';
import { NotificationOptions } from '../interfaces';

@Processor('sms')
export class SmsConsumer {
    private client?: SNSClient;

    constructor(@Inject(NOTIFICATION_OPTIONS) private options: NotificationOptions) {
        if (options.sms.enabled === false) return;

        this.client = new SNSClient({
            region: options.sms.aws.region,
            credentials: {
                accessKeyId: options.sms.aws.accessKeyId,
                secretAccessKey: options.sms.aws.secretAccessKey,
            },
        });

        this.options.logger?.debug('SMS consumer initalised', {
            region: options.sms.aws.region,
            sender: options.sms.sender,
            messageType: options.sms.messageType,
        });
    }

    /**
     * Send an SMS to a set of numbers
     * @param to List of mobile numbers (E.164)
     * @param message String to send (max 140 characters)
     */
    @Process()
    async send({ data: { to, message } }: Job<ISMSPayload>): Promise<any> {
        if (this.options.sms.enabled === false) return this.options.logger?.warn('SMS notifications are disabled');

        await Promise.all(
            to.map(async (number) => {
                if (!this.validate(number)) return null;
                if (this.options.sms.enabled === false) return null;

                try {
                    const res = await this.client?.send(
                        new PublishCommand({
                            Message: message,
                            PhoneNumber: number,
                            MessageAttributes: {
                                'AWS.SNS.SMS.SenderID': {
                                    DataType: 'String',
                                    StringValue: this.options.sms.sender ?? 'ChelseaApps',
                                },
                                'AWS.SNS.SMS.SMSType': {
                                    DataType: 'String',
                                    StringValue: this.options.sms.messageType ?? 'Transactional',
                                },
                            },
                        }),
                    );

                    this.options.logger?.info(`SMS notifications delivered`, {
                        to,
                    });

                    return res?.MessageId ?? null;
                } catch (err) {
                    // Failed to send SMS
                    this.options.logger?.error('Failed to send SMS', err);
                }
                return null;
            }),
        );
    }

    /**
     * Check if a given phone number is in the E164 format
     * @param phoneNumber Phone number
     */
    private validate(phoneNumber: string) {
        const regEx = /^\+[1-9]\d{10,14}$/;

        return regEx.test(phoneNumber);
    }
}
