# Notification

Send email, SMS and push\* notifications to users on Chelsea Apps projects.

> Push notifications are not yet implemented

### Installation

The project is hosted on our private npm registry, so to install simply run

##### npm

```bash
npm i @chelseaapps/notification
```

##### yarn

```bash
yarn add @chelseaapps/notification
```

### Requirements

The Email, SMS and Push methods are all sent using a separate process, via Redis. You must have a Redis server running locally on the default host & port (for now, will add Redis config parameters to the options in the future).

### Configuration

The module can be imported either globally or restricted to a single module scope. The default option is global, as this allows the module to be used across multiple modules without having to configure it multiple times.

#### Config options

| Option                      | Description                                                | Example                             |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------- |
| isGlobal                    | Register the module globally across all modules in the app | true                                |
| email > host                | SMTP email host                                            | email-smtp.eu-west-2.amazonaws.com  |
| email > port                | SMTP email port                                            | 465                                 |
| email > user                | SMTP user                                                  | AKIAZQJAQWWNH7QEHL4O                |
| email > password            | SMTP password                                              | \*\*\*\*                            |
| email > from                | 'From' details for email headers                           | "Chelsea Apps" ben@chelsea-apps.com |
| sms > aws > region          | AWS region used for SNS                                    | eu-west-2                           |
| sms > aws > accessKeyId     | AWS access key ID with SNS IAM privileges                  | AKIAZQJAQWWNEGDK5YGP                |
| sms > aws > secretAccessKey | Corresponding AWS secret key                               | \*\*\*\*                            |
| sms > sender                | SMS sender ID (max 12 characters)                          | FExchange                           |
| sms > messageType           | Type of message being sent (Transactional or Promotional)  | Transactional                       |

The module can be configured in two ways:

-   Regular
-   Asynchronous

#### Regular config

Import the module into the module in which you wish to register, and call the static `register` function.

```typescript
import { Module } from '@nestjs/common';
import { NotificationModule } from '@chelseaapps/notification';

@Module({
	imports: [
        ... other imports here
		NotificationModule.register({
			isGlobal: true,
            email: {
                host: "",
                port: 465,
                user: "",
                password: "",
                from: "",
            },
            sms: {
                aws: {
                    region: "",
                    accessKeyId: "",
                    secretAccessKey: "",
                },
                sender: "",
                messageType: "",
            },
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
```

#### Asynchronous config

The module can also be registered asynchronously to create the module dynamically, fetching configuration details from an external source (such as an environment variable).

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from '@chelseaapps/notification';

@Module({
    imports: [
        NotificationModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                email: {
                    host: configService.get('EMAIL_HOST')!,
                    port: configService.get('EMAIL_PORT')!,
                    user: configService.get('EMAIL_USER')!,
                    password: configService.get('EMAIL_PASSWORD')!,
                    from: configService.get('EMAIL_FROM')!,
                },
                sms: {
                    aws: {
                        region: configService.get('AWS_REGION')!,
                        accessKeyId: configService.get('AWS_ACCESS_KEY_ID')!,
                        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')!,
                    },
                    sender: configService.get('SMS_SENDER')!,
                    messageType: configService.get('SMS_MESSAGE_TYPE')!,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
```

### Usage

Import the NotificationService into a module using the Nest depedency injection mechanism.

```typescript
import { NotificationService} from "@chelseaapps/notification"

@Injectable()
export class UserService {
	constructor(
		private notificationService: NotificationService,
	) {}

    ...
    async test() {
        await this.notificationService.send(new TestNotification())
    }
}
```

Where `TestNotification` is a class extending the `INotification` interface (see below).

```typescript
import { INotification, NotificationMethod } from '@chelseaapps/notification';

class TestNotification implements INotification {
    // MJML or raw HTML email template here
    private template = `
        <mjml></mjml>
    `;

    // Array of notification methods (email, SMS, push)
    methods = [NotificationMethod.Email];

    // Email subject
    subject = 'Welcome to Uplevyl (Alpha)!';

    // Single user or list of multiple users as recipients
    to: User | User[];

    // Override default email sender
    from: string = 'Chelsea Apps <ben@chelsea-apps.com>';

    // Body for all notifcations (see below to override for each method)
    body: string;

    // Email specific body (overrides the body field)
    emailBody: string;

    // SMS specific body (overrides the body field)
    smsBody: string;

    constructor(user: User) {
        // Configure details and compile MJML (if using)
        const renderedTemplate = this.render(this.template, user.firstName);
        const { html } = this.complile(renderedTemplate);

        if (!html) throw new Error('Unable to compile email to HTTP');

        this.to = user;
        this.emailBody = html;
    }

    // Render using mustache
    private render(template: string, name: string) {
        return mustache.render(template, {
            name,
        });
    }

    // Compile MJML to HTML
    private complile(template: string) {
        return mjml2html(template);
    }
}
```

#### Mustache & MJML

Normally we use Mustache to template emails and MJML to compile to HTML. This makes it easier to send personalised, responsive emails. However these are not required.
The `NotificationService` expects the `body` or `emailBody` parameters to be plain text or HTML, so any templating and email markup libraries can be used (provided they compile to HTML).

#### Custom Notification Handlers

Custom handlers can be registered to listen for notifications with the `NotificationMethod.Custom` capability registered.
These handlers will receieve the whole notification payload and any custom data to handle in any way they want.

**Example Notification**

```typescript
import { INotification, INotificationUser, NotificationMethod } from '@chelsea-apps/notification';

export class TestNotification implements INotification {
    methods: NotificationMethod[] = [NotificationMethod.Custom];

    to: INotificationUser[] = [
        {
            email: 'ben@chelsea-apps.com',
        },
    ];

    subject = 'Subject';
    subtitle = 'Subtitle';
    body = 'Body';
    pushPayload?: Record<string, any> = { push: 'payload' };
    data?: Record<string, any> = {
        data: 'any',
    };
}
```

To register a custom handler, use the `@CustomNotificationProcessor()` decorator to create a _Consumer_ class.

**Example class to send to Onesignal**

```typescript
import { CustomNotificationProcessor, ICustomPayload, INotificationUser } from '@chelsea-apps/notification';
import { OnesignalService } from '@chelsea-apps/onesignal';
import { Process } from '@nestjs/bull';
import { Job } from 'bull';

@CustomNotificationProcessor()
export class OnesignalConsumer {
    constructor(private readonly onesignalService: OnesignalService) {}

    @Process()
    async send({ data }: Job<ICustomPayload>) {
        const ids = data.data?.to
            ?.filter((to: INotificationUser) => to.id)
            .map((to: INotificationUser) => to.id) as string[];

        if (ids.length === 0) return;
        if (!data.push) return;

        await this.onesignalService.send(ids, {
            title: data.push.alert.title ?? '',
            subtitle: data.push.alert.subtitle,
            message: data.push.alert.body,
            payload: data.push.payload,
            threadId: data.data?.threadId,
            url: data.data?.url,
        });
    }
}
```

### Documentation

Detailed documentation of the methods can be found in the `documentation` folder. They can be hosted locally by running

```bash
npx serve
```

from the `documentation` folder, and are also hosted on the [Chelsea Apps Gitbook](https://docs.chelsea-apps.com/libraries/notification).
