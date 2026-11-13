import type { ComponentHarness, HarnessLoader, HarnessQuery } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import type { Type } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';

export interface TestEnvironment<Host, Harness extends ComponentHarness> {
    fixture: ComponentFixture<Host>;
    harness: Harness;
    harnessLoader: HarnessLoader;
}

/**
 * Creates the host component of a test and loads the harness of the component under test from it. Configure the
 * providers that the test needs with `TestBed.configureTestingModule` before calling it.
 */
export async function setupTestEnvironment<Host, Harness extends ComponentHarness>(
    host: Type<Host>,
    harness: HarnessQuery<Harness>,
): Promise<TestEnvironment<Host, Harness>> {
    const fixture = TestBed.createComponent(host);
    const harnessLoader = TestbedHarnessEnvironment.loader(fixture);

    return {
        fixture,
        harness: await harnessLoader.getHarness(harness),
        harnessLoader,
    };
}
