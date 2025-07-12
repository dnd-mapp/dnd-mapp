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
                    input: 'apps/api-gateway/src/assets',
                    glob: '**/*',
                    ignore: ['**/.gitkeep'],
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
