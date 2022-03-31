import { Processor } from '@nestjs/bull';
import { applyDecorators } from '@nestjs/common';

export function CustomNotificationProcessor() {
    return applyDecorators(Processor('custom'));
}
