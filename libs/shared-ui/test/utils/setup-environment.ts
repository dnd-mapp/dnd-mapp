import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

interface SetupEnvironmentParams<Component, Harness extends ComponentHarness> {
    component: Type<Component>;
    harness: HarnessQuery<Harness>;
    providers?: unknown[];
}

export async function setupEnvironment<Component, Harness extends ComponentHarness>(
    params: SetupEnvironmentParams<Component, Harness>,
) {
    TestBed.configureTestingModule({
        imports: [params.component],
        providers: [...(params.providers ?? [])],
    });

    const harnessLoader = TestbedHarnessEnvironment.loader(TestBed.createComponent(params.component));

    return {
        harness: await harnessLoader.getHarness(params.harness),
        harnessLoader: harnessLoader,
    };
}
