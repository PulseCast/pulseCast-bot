import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { MatchOutcome } from './match.schema';

export type TradeLogDocument = mongoose.HydratedDocument<TradeLog>;

export enum TradeAction {
  BUY = 'buy',
  SELL = 'sell',
}

@Schema({ timestamps: true })
export class TradeLog {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true })
  market: mongoose.Schema.Types.ObjectId;

  @Prop({ enum: TradeAction, required: true })
  action: TradeAction;

  @Prop({ enum: MatchOutcome, required: true })
  side: MatchOutcome;

  @Prop() amount: string; // money paid in (BUY) or taken out (SELL)

  @Prop() shares: string; // number of position tokens gained or lost

  @Prop() odds: string; // odds at the time of this action
}

export const TradeLogSchema = SchemaFactory.createForClass(TradeLog);
