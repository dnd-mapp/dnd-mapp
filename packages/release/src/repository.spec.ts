import { repositoryUrl } from './repository.ts';

describe('repositoryUrl', () => {
    it.each([
        ['an object with a git+https URL', { type: 'git', url: 'git+https://github.com/critsource/critsource.git' }],
        ['an https URL', 'https://github.com/critsource/critsource'],
        ['an https URL with a trailing slash', 'https://github.com/critsource/critsource/'],
        ['a git URL', 'git://github.com/critsource/critsource.git'],
        ['an ssh URL', 'git+ssh://git@github.com/critsource/critsource.git'],
        ['the scp-like syntax of git', 'git@github.com:critsource/critsource.git'],
        ['the github: shorthand', 'github:critsource/critsource'],
        ['the shorthand without a prefix', 'critsource/critsource'],
    ])('reads %s', (_, field) => {
        expect(repositoryUrl(field)).toBe('https://github.com/critsource/critsource');
    });

    it('keeps the host of a repository outside GitHub', () => {
        expect(repositoryUrl('https://git.example.com/team/app.git')).toBe('https://git.example.com/team/app');
    });

    it.each([
        ['a missing field', undefined],
        ['an object without a URL', { type: 'git' }],
        ['a URL without an owner', 'https://github.com/critsource'],
        ['a URL of another protocol', 'file:///repos/dnd-mapp'],
        ['the gitlab: shorthand', 'gitlab:critsource/critsource'],
        ['text that is no URL', 'the D&D Mapp repository'],
    ])('returns undefined for %s', (_, field) => {
        expect(repositoryUrl(field)).toBeUndefined();
    });
});
