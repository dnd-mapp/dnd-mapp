const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const isRunningInProduction = process.env['NODE_ENV'] === 'production';

module.exports = {
    output: {
        path: join(__dirname, '../../dist/apps/roles'),
    },
    plugins: [
        new NxAppWebpackPlugin({
            assets: [
                {
                    input: 'apps/roles/src/assets',
                    glob: '**/*',
                    ignore: ['**/.gitkeep'],
                    output: 'assets',
                },
            ],
            compiler: 'tsc',
            externalDependencies: 'all',
            extractLicenses: isRunningInProduction,
            generatePackageJson: isRunningInProduction,
            main: './src/main.ts',
            namedChunks: !isRunningInProduction,
            optimization: isRunningInProduction,
            outputHashing: 'none',
            sourceMap: false,
            target: 'node',
            tsConfig: './tsconfig.app.json',
        }),
    ],
};
