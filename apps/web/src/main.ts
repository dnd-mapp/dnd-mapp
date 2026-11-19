import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, RootComponent } from '@critsource/core-web';

bootstrapApplication(RootComponent, appConfig).catch((error: unknown) => {
    console.error(error);
});
