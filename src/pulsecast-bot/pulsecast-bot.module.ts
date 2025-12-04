import { Module } from '@nestjs/common';
import { PulsecastBotService } from './pulsecast-bot.service';
import { HttpModule } from '@nestjs/axios';
import { MarkupService } from './markup.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/database/schemas/user.schema';
import { WalletModule } from 'src/wallet/wallet.module';
import { Session, SessionSchema } from 'src/database/schemas/session.schema';
import { PredictionOracleModule } from 'src/prediction-oracle/prediction-oracle.module';
import { Market, MarketSchema } from 'src/database/schemas/market.schema';
import { Match, MatchSchema } from 'src/database/schemas/match.schema';
import { TradeModule } from 'src/trade/trade.module';
import { Position, PositionSchema } from 'src/database/schemas/position.schema';
import { Url, UrlSchema } from 'src/database/schemas/url.schema';

@Module({
  imports: [
    HttpModule,
    WalletModule,
    PredictionOracleModule,
    TradeModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Market.name, schema: MarketSchema },
      { name: Match.name, schema: MatchSchema },
      { name: Position.name, schema: PositionSchema },
      { name: Url.name, schema: UrlSchema },
    ]),
  ],
  providers: [PulsecastBotService, MarkupService],
  exports: [MarkupService],
})
export class PulsecastBotModule {}
