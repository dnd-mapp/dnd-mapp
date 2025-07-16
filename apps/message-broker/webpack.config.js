const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const isRunningInProd = process.env['NODE_ENV'] === 'production';

module.exports = {
    output: {
        path: join(__dirname, '../../dist/apps/message-broker'),
    },
    plugins: [
        new NxAppWebpackPlugin({
            assets: ['./src/assets'],
            compiler: 'tsc',
            externalDependencies: 'all',
            extractLicenses: isRunningInProd,
            generatePackageJson: isRunningInProd,
            main: './src/main.ts',
            namedChunks: !isRunningInProd,
            optimization: isRunningInProd,
            outputHashing: 'none',
            sourceMap: !isRunningInProd,
            target: 'node',
            tsConfig: './tsconfig.app.json',
        }),
    ],
};
