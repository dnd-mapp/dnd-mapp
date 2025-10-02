import { inject, provideAppInitializer } from '@angular/core';
import { ConfigService } from './config.service';

export function provideAppConfig() {
    return provideAppInitializer(() => {
        const configService = inject(ConfigService);
        return configService.initialize();
    });
}
