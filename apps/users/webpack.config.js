const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
    output: {
        path: join(__dirname, '../../dist/apps/users'),
    },
    plugins: [
        new NxAppWebpackPlugin({
            assets: [
                {
                    input: 'apps/users/src/assets',
                    glob: '**/*',
                    ignore: ['**/.gitkeep'],
                    output: 'assets',
                },
            ],
            commonChunk: true,
            compiler: 'tsc',
            externalDependencies: 'all',
            extractLicenses: true,
            generatePackageJson: true,
            main: './src/main.ts',
            namedChunks: true,
            optimization: false,
            outputHashing: 'none',
            runtimeChunk: true,
            sourceMap: false,
            target: 'node',
            tsConfig: './tsconfig.app.json',
            vendorChunk: true,
        }),
    ],
};
