const nxPreset = require('@nx/jest/preset').default;

const isCI = Boolean(process.env['CI']);

module.exports = {
    ...nxPreset,
    ci: isCI,
    passWithNoTests: true,
    randomize: true,
    showSeed: true,
};
