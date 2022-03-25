import { Module, DynamicModule, Provider, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from './notification.service';
import { NOTIFICATION_OPTIONS } from './constants';
import { NotificationOptions, NotificationAsyncOptions, NotificationOptionsFactory } from './interfaces';
import { createNotificationProviders } from './notification.providers';
import { EmailConsumer } from './email/email.consumer';
import { SmsConsumer } from './sms/sms.consumer';
import { PushConsumer } from './push/push.consumer';

@Global()
@Module({
    providers: [NotificationService, EmailConsumer, SmsConsumer, PushConsumer],
    exports: [NotificationService],
})
export class NotificationModule {
    /**
     * Registers a configured Notification Module for import into the current module
     */
    public static register(options: NotificationOptions): DynamicModule {
        return {
            global: options.isGlobal ?? true,
            imports: this.createImports(),
            module: NotificationModule,
            providers: createNotificationProviders(options),
        };
    }

    /**
     * Registers a configured Notification Module for import into the current module
     * using dynamic options (factory, etc)
     */
    public static registerAsync(options: NotificationAsyncOptions): DynamicModule {
        return {
            global: options.isGlobal ?? true,
            imports: this.createImports(),
            module: NotificationModule,
            providers: [...this.createProviders(options)],
        };
    }

    private static createProviders(options: NotificationAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createOptionsProvider(options)];
        }

        return [
            this.createOptionsProvider(options),
            {
                provide: options.useClass!,
                useClass: options.useClass!,
            },
        ];
    }

    private static createOptionsProvider(options: NotificationAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: NOTIFICATION_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        // For useExisting...
        return {
            provide: NOTIFICATION_OPTIONS,
            useFactory: async (optionsFactory: NotificationOptionsFactory) =>
                await optionsFactory.createNotificationOptions(),
            inject: [options.useExisting || options.useClass!],
        };
    }

    /**
     * Register imports for module
     * @returns Imports
     */
    private static createImports(): DynamicModule[] {
        return [
            BullModule.registerQueue(
                {
                    name: 'email',
                },
                {
                    name: 'sms',
                },
                {
                    name: 'push',
                },
            ),
        ];
    }
}
