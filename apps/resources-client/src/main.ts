// organize-imports-ignore
import 'reflect-metadata';
import { bootstrapApplication } from '@angular/platform-browser';
import { tryCatchAsync } from '@dnd-mapp/shared';
import { appConfig, RootComponent } from './app';

async function bootstrap() {
    const { error } = await tryCatchAsync(bootstrapApplication(RootComponent, appConfig));

    if (error) {
        console.error(error);
    }
}

(async () => await bootstrap())();
