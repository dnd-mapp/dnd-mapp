import { resolve } from 'path';

export const appPath = process.env['NODE_ENV'] === 'test' ? resolve(__dirname, '..') : __dirname;
