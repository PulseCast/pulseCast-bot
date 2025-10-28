import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PulsecastBotModule } from './pulsecast-bot/pulsecast-bot.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { PredictionOracleModule } from './prediction-oracle/prediction-oracle.module';
import { PotModule } from './pot/pot.module';
import { TradeModule } from './trade/trade.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    DatabaseModule,
    PulsecastBotModule,
    UserModule,
    EventModule,
    PotModule,
    TradeModule,
    WalletModule,
    PredictionOracleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
