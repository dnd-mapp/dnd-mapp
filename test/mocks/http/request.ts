import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

interface MakeRequestParams {
    url: string;
    body: Parameters<TestRequest['flush']>[0];
    headers?: Record<string, string | string[]>;
    status?: number;
    statusText?: string;
}

export function expectRequest(params: MakeRequestParams) {
    const httpTestingController = TestBed.inject(HttpTestingController);
    const { url, body, headers, status, statusText } = params;

    const request = httpTestingController.expectOne(url);

    request.flush(body, {
        ...(headers ? { headers: headers } : {}),
        ...(status && statusText ? { status: status, statusText: statusText } : {}),
    });
}
