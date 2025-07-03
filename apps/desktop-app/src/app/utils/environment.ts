import { env } from 'process';
import { environment } from '../../environments';

export const isRunningInDevelopmentMode = () =>
    'ELECTRON_IS_DEV' in env ? parseInt(env['ELECTRON_IS_DEV'], 10) === 1 : !environment.production;
