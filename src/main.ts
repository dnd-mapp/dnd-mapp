import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/config/app.config';
import { RootComponent } from './app/core/root/root.component';

bootstrapApplication(RootComponent, appConfig).catch((err) => console.error(err));
