import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function configureCors(origins: string[]) {
    return {
        allowedHeaders: ['Content-Type'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        origin: [...origins],
    } satisfies CorsOptions;
}
