import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PulsecastBotModule } from './pulsecast-bot/pulsecast-bot.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [DatabaseModule, PulsecastBotModule, UserModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
