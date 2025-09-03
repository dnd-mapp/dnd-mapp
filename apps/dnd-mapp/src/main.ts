import { bootstrapApplication } from '@angular/platform-browser';
import { tryCatch } from '@dnd-mapp/shared';
import { appConfig, RootComponent } from './app';

async function bootstrap() {
    const { error } = await tryCatch(bootstrapApplication(RootComponent, appConfig));

    if (error) {
        console.error(error);
    }
}

(async () => await bootstrap())();
