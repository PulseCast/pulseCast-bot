import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PulsecastBotModule } from './pulsecast-bot/pulsecast-bot.module';

@Module({
  imports: [DatabaseModule, PulsecastBotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
