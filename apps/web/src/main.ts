import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, RootComponent } from '@dnd-mapp/core-web';

bootstrapApplication(RootComponent, appConfig).catch((error: unknown) => {
    console.error(error);
});
