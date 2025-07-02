const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
    output: {
        path: join(__dirname, '../../dist/apps/api-gateway'),
    },
    plugins: [
        new NxAppWebpackPlugin({
            assets: [
                {
                    input: '../../libs/api-shared/src/assets',
                    glob: '*.proto',
                    output: 'assets',
                },
            ],
            compiler: 'tsc',
            generatePackageJson: true,
            main: './src/main.ts',
            optimization: false,
            outputHashing: 'none',
            target: 'node',
            tsConfig: './tsconfig.app.json',
        }),
    ],
};
