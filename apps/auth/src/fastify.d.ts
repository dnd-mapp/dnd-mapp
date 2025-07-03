import { ScopeName, User } from '@dnd-mapp/auth';
import '@fastify/cookie';
import 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        authenticatedUser?: User;
        scopes?: ScopeName[];
    }
}
