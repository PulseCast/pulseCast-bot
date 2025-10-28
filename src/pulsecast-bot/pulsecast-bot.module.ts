import { Module } from '@nestjs/common';
import { PulsecastBotService } from './pulsecast-bot.service';
import { HttpModule } from '@nestjs/axios';
import { MarkupService } from './markup.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { WalletModule } from 'src/wallet/wallet.module';
import { Session, SessionSchema } from 'src/database/schemas/session.schema';
import { PredictionOracleModule } from 'src/prediction-oracle/prediction-oracle.module';

@Module({
  imports: [
    HttpModule,
    WalletModule,
    PredictionOracleModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  providers: [PulsecastBotService, MarkupService],
})
export class PulsecastBotModule {}
