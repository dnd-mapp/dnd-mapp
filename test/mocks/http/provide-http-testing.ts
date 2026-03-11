import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

export function provideHttpTesting() {
    return [provideHttpClient(withFetch()), provideHttpClientTesting()];
}
