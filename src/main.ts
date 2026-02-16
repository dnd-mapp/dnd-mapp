import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, RootComponent } from './app';

bootstrapApplication(RootComponent, appConfig).catch((error) => console.error(error));
