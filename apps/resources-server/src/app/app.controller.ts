import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Controller()
export class AppController {
    @Get()
    @HttpCode(HttpStatus.FOUND)
    public redirectFromRoot(@Res() response: FastifyReply) {
        return response.redirect('/app');
    }

    @Get('/app')
    @HttpCode(HttpStatus.FOUND)
    public redirectFromApp(@Res() response: FastifyReply) {
        return response.redirect('/app/');
    }
}
