import { Component } from '@angular/core';
import { provideRouter, Routes, withHashLocation } from '@angular/router';
import { applicationConfig, Meta, StoryObj } from '@storybook/angular';
import { NavigationBarStoryComponent } from './navigation-bar-story.component';

@Component({
    selector: 'dma-dummy',
    template: ``,
})
export class DummyComponent {}

const routes: Routes = [
    {
        path: '',
        component: DummyComponent,
    },
    {
        path: 'browse',
        component: DummyComponent,
    },
    {
        path: 'radio',
        component: DummyComponent,
    },
    {
        path: 'library',
        component: DummyComponent,
    },
];

const meta = {
    title: 'Components/Navigation bar',
    tags: ['!dev'],
    component: NavigationBarStoryComponent,
    decorators: [
        applicationConfig({
            providers: [provideRouter(routes, withHashLocation())],
        }),
    ],
    args: {},
    argTypes: {},
} satisfies Meta<NavigationBarStoryComponent>;

export default meta;

type Story = StoryObj<NavigationBarStoryComponent>;

export const Default: Story = {
    tags: ['dev'],
    name: 'Interactive',
};
