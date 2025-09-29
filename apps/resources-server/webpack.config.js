const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const productionMode = process.env['NODE_ENV'] === 'production';

module.exports = {
    output: {
        clean: true,
        path: join(__dirname, '../../dist/apps/resources-server'),
        ...(!productionMode && {
            devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        }),
    },
    plugins: [
        new NxAppWebpackPlugin({
            assets: ['./src/assets'],
            compiler: 'tsc',
            externalDependencies: 'all',
            extractLicenses: productionMode,
            generatePackageJson: productionMode,
            main: './src/main.ts',
            namedChunks: !productionMode,
            optimization: productionMode,
            outputHashing: 'none',
            sourceMaps: !productionMode,
            target: 'node',
            tsConfig: './tsconfig.app.json',
        }),
    ],
};
