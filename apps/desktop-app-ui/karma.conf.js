const { join } = require('path');

// Karma configuration file, see link for more information
// https://karma-runner.github.io/6.4/config/configuration-file.html
module.exports = (config) => {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-jasmine-html-reporter', 'karma-coverage'],
        client: {
            useIframe: false,
            jasmine: {
                // you can add configuration options for Jasmine here
                // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
                // for example, you can disable the random execution with `random: false`
                // or set a specific seed with `seed: 4321`
                random: true,
            },
        },
        jasmineHtmlReporter: {
            suppressAll: true,
        },
        coverageReporter: {
            dir: join(__dirname, '../../reports/apps/desktop-app-ui'),
            // check: {
            //     branches: 80,
            //     functions: 80,
            //     lines: 80,
            //     statements: 80,
            //     excludes: [],
            // },
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }],
        },
        reporters: ['dots', 'kjhtml'],
        browsers: ['ChromeHeadless'],
        restartOnFileChange: true,
        failOnEmptyTestSuite: false,
        reportSlowerThan: 300,
    });
};
