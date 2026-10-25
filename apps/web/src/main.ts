import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig, RootComponent } from '@/core';

bootstrapApplication(RootComponent, appConfig).catch((error) => console.error(error));
