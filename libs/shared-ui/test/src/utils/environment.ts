import { ComponentHarness, HarnessLoader, HarnessQuery } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideZonelessChangeDetection, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

interface CreateTestEnvironmentParams<T, H extends ComponentHarness> {
    testComponent?: Type<T>;
    harness?: Type<H>;
    imports?: unknown[];
    providers?: unknown[];
    initFunction?: () => void | Promise<void>;
}

export async function createTestEnvironment<T, H extends ComponentHarness>(params: CreateTestEnvironmentParams<T, H>) {
    let fixture: ComponentFixture<T>;
    let harnessLoader: HarnessLoader;
    let harness: H;

    TestBed.configureTestingModule({
        imports: [...(params.imports ?? []), ...(params.testComponent ? [params.testComponent] : [])],
        providers: [provideZonelessChangeDetection(), ...(params.providers ?? [])],
        animationsEnabled: false,
    });

    if (params.initFunction) await params.initFunction();
    if (params.testComponent) {
        fixture = TestBed.createComponent<T>(params.testComponent);
        harnessLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

        if (params.harness) harness = await harnessLoader.getHarness<H>(params.harness as HarnessQuery<H>);
        return {
            fixture: fixture,
            component: fixture.componentInstance,
            harnessLoader: harnessLoader,
            harness: harness,
        };
    }
    return null;
}
