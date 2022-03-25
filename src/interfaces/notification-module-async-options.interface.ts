/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
import { NotificationOptions } from './notification-options.interface';
import { NotificationOptionsFactory } from './notification-options-factory.interface';

export interface NotificationAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    /**
     * Register the module globally? Default `true`
     */
    isGlobal?: boolean;
    inject?: any[];
    useExisting?: Type<NotificationOptionsFactory>;
    useClass?: Type<NotificationOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<NotificationOptions> | NotificationOptions;
}
