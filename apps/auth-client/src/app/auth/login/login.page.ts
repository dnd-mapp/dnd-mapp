import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'dma-login',
    templateUrl: './login.page.html',
    styleUrl: './login.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class LoginPage {}
