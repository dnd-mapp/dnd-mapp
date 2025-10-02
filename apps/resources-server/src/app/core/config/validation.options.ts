import { transformOptions } from '@dnd-mapp/shared';
import { HttpStatus, ValidationPipeOptions } from '@nestjs/common';

export const validationOptions: ValidationPipeOptions = {
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    exceptionFactory: (errors) => errors[0],
    transform: true,
    transformOptions: transformOptions,
    whitelist: true,
};
