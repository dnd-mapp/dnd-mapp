import type { ComponentHarness, HarnessLoader, HarnessQuery } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import type { Type } from '@angular/core';
import { type ComponentFixture, TestBed, type TestModuleMetadata } from '@angular/core/testing';

/** What the testing module of a test needs, such as a stand-in for a token or a service. */
export interface TestEnvironmentOptions {
    providers?: TestModuleMetadata['providers'];
    imports?: TestModuleMetadata['imports'];
}

/** The options of a component test, which also names the host component and the harness of the component. */
export interface ComponentTestEnvironmentOptions<
    Host,
    Harness extends ComponentHarness,
> extends TestEnvironmentOptions {
    host: Type<Host>;
    harness: HarnessQuery<Harness>;
}

export interface TestEnvironment<Host, Harness extends ComponentHarness> {
    fixture: ComponentFixture<Host>;
    harness: Harness;
    harnessLoader: HarnessLoader;
}

/** Configures the testing module of a test without a component, such as the test of a service. */
export function setupTestEnvironment(options?: TestEnvironmentOptions): void;

/**
 * Configures the testing module, creates the host component of a test, and loads the harness of the component under
 * test from it.
 */
export function setupTestEnvironment<Host, Harness extends ComponentHarness>(
    options: ComponentTestEnvironmentOptions<Host, Harness>,
): Promise<TestEnvironment<Host, Harness>>;

export function setupTestEnvironment<Host, Harness extends ComponentHarness>(
    options: TestEnvironmentOptions | ComponentTestEnvironmentOptions<Host, Harness> = {},
): Promise<TestEnvironment<Host, Harness>> | undefined {
    TestBed.configureTestingModule({ providers: options.providers ?? [], imports: options.imports ?? [] });

    return 'host' in options ? createComponent(options.host, options.harness) : undefined;
}

async function createComponent<Host, Harness extends ComponentHarness>(
    host: Type<Host>,
    harness: HarnessQuery<Harness>,
) {
    const fixture = TestBed.createComponent(host);
    const harnessLoader = TestbedHarnessEnvironment.loader(fixture);

    return {
        fixture,
        harness: await harnessLoader.getHarness(harness),
        harnessLoader,
    };
}
