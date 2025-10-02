import { NgModule, provideZonelessChangeDetection } from '@angular/core';

@NgModule({
    providers: [provideZonelessChangeDetection()],
})
export class ZonelessTestingModule {}
