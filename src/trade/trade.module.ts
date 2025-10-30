import { forwardRef, Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { Session, SessionSchema } from 'src/database/schemas/session.schema';
import { Match, MatchSchema } from 'src/database/schemas/match.schema';
import { Market, MarketSchema } from 'src/database/schemas/market.schema';
import { Position, PositionSchema } from 'src/database/schemas/position.schema';
import { PredictionOracleModule } from 'src/prediction-oracle/prediction-oracle.module';
import { PulsecastBotModule } from 'src/pulsecast-bot/pulsecast-bot.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    PredictionOracleModule,
    WalletModule,
    TradeModule,
    forwardRef(() => PulsecastBotModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Market.name, schema: MarketSchema },
      { name: Match.name, schema: MatchSchema },
      { name: Position.name, schema: PositionSchema },
    ]),
  ],
  providers: [TradeService],
  exports: [TradeService],
})
export class TradeModule {}
