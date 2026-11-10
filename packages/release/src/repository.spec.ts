import { describe, expect, it } from 'vitest';
import { repositoryUrl } from './repository.ts';

describe('repositoryUrl', () => {
    it.each([
        ['an object with a git+https URL', { type: 'git', url: 'git+https://github.com/dnd-mapp/dnd-mapp.git' }],
        ['an https URL', 'https://github.com/dnd-mapp/dnd-mapp'],
        ['an https URL with a trailing slash', 'https://github.com/dnd-mapp/dnd-mapp/'],
        ['a git URL', 'git://github.com/dnd-mapp/dnd-mapp.git'],
        ['an ssh URL', 'git+ssh://git@github.com/dnd-mapp/dnd-mapp.git'],
        ['the scp-like syntax of git', 'git@github.com:dnd-mapp/dnd-mapp.git'],
        ['the github: shorthand', 'github:dnd-mapp/dnd-mapp'],
        ['the shorthand without a prefix', 'dnd-mapp/dnd-mapp'],
    ])('reads %s', (_, field) => {
        expect(repositoryUrl(field)).toBe('https://github.com/dnd-mapp/dnd-mapp');
    });

    it('keeps the host of a repository outside GitHub', () => {
        expect(repositoryUrl('https://git.example.com/team/app.git')).toBe('https://git.example.com/team/app');
    });

    it.each([
        ['a missing field', undefined],
        ['an object without a URL', { type: 'git' }],
        ['a URL without an owner', 'https://github.com/dnd-mapp'],
        ['a URL of another protocol', 'file:///repos/dnd-mapp'],
        ['the gitlab: shorthand', 'gitlab:dnd-mapp/dnd-mapp'],
        ['text that is no URL', 'the D&D Mapp repository'],
    ])('returns undefined for %s', (_, field) => {
        expect(repositoryUrl(field)).toBeUndefined();
    });
});
