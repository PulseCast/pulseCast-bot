import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MarketDocument = mongoose.HydratedDocument<Market>;

export enum MarketStatus {
  PRE = 'pre',
  LIVE = 'live',
  FINISHED = 'finished',
  SETTLED = 'settled',
}

@Schema({ timestamps: true })
export class Market {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true })
  match: mongoose.Schema.Types.ObjectId;

  @Prop({ enum: MarketStatus, default: MarketStatus.PRE })
  status: MarketStatus;

  @Prop({ default: '0' })
  potHome: string;

  @Prop({ default: '0' })
  potDraw: string;

  @Prop({ default: '0' })
  potAway: string;

  @Prop()
  homeOdds: string;

  @Prop()
  drawOdds: string;

  @Prop()
  awayOdds: string;

  @Prop({ default: 0 })
  liquidity: string;
}

export const MarketSchema = SchemaFactory.createForClass(Market);
