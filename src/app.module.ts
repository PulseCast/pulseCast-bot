import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PulsecastBotModule } from './pulsecast-bot/pulsecast-bot.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { PredictionOracleModule } from './prediction-oracle/prediction-oracle.module';

@Module({
  imports: [DatabaseModule, PulsecastBotModule, UserModule, EventModule, PredictionOracleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
