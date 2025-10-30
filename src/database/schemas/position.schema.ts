import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Outcome } from './match.schema';

export type PositionDocument = mongoose.HydratedDocument<Position>;

@Schema({ timestamps: true })
export class Position {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true })
  market: mongoose.Schema.Types.ObjectId;

  @Prop({ enum: Outcome, required: true })
  side: Outcome;

  @Prop({ required: true })
  entryProbability: string; // market when purchased

  @Prop({ required: true })
  shares: string; // immutable total shares bought

  @Prop({ required: true })
  remainingShares: string;

  @Prop({ required: true })
  stakePaid: string;

  @Prop({ default: false })
  settled: boolean;

  @Prop()
  finalPayout: string;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
