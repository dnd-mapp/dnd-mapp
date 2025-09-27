import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, RootComponent, tryCatchAsync } from './app';

async function bootstrap() {
    const { error } = await tryCatchAsync(bootstrapApplication(RootComponent, appConfig));

    if (error) {
        console.error(error);
    }
}

(async () => await bootstrap())();
