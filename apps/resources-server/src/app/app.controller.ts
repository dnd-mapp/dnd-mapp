import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('/data')
    public getData() {
        return { message: 'Hello from Resources server' };
    }
}
