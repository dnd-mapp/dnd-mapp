import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SpellsModule } from './spells';

@Module({
    imports: [SpellsModule],
    controllers: [AppController],
})
export class AppModule {}
