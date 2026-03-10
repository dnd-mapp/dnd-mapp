import { ComponentHarness, HarnessLoader, HarnessQuery } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStorage } from '../mocks';

interface SetupTestEnvironmentParams<C, H extends ComponentHarness> {
    testComponent?: Type<C>;
    harness?: HarnessQuery<H>;
    imports?: unknown[];
    providers?: unknown[];
}

export async function setupTestEnvironment<C, H extends ComponentHarness>(
    params: SetupTestEnvironmentParams<C, H> = {}
) {
    TestBed.configureTestingModule({
        imports: [...(params.testComponent ? [params.testComponent] : []), ...(params.imports ?? [])],
        providers: [...(params.providers ?? []), provideMockStorage()],
    });

    let fixture: ComponentFixture<C> | undefined;
    let harnessLoader: HarnessLoader | undefined;
    let harness: H | undefined;

    if (params.testComponent) {
        fixture = TestBed.createComponent(params.testComponent);
        harnessLoader = TestbedHarnessEnvironment.loader(fixture);
    }
    if (params.harness) {
        if (!harnessLoader) throw new Error('HarnessLoader is missing');
        harness = await harnessLoader.getHarness(params.harness);
    }
    return {
        ...(fixture
            ? { fixture: fixture, componentInstance: fixture.componentInstance, componentRef: fixture.componentRef }
            : {}),
        ...(harnessLoader ? { harnessLoader: harnessLoader } : {}),
        ...(harness ? { harness: harness } : {}),
    };
}
