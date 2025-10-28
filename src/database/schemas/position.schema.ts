import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { MatchOutcome } from './match.schema';

export type PositionDocument = mongoose.HydratedDocument<Position>;

@Schema({ timestamps: true })
export class Position {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Market', required: true })
  market: mongoose.Schema.Types.ObjectId;

  @Prop({ enum: MatchOutcome, required: true })
  side: MatchOutcome;

  @Prop({ required: true })
  entryOdds: string; // odds when purchased

  @Prop({ required: true })
  shares: string; // immutable total shares bought

  @Prop({ required: true })
  remainingShares: string;

  @Prop({ required: true })
  stakePaid: number;

  @Prop({ default: false })
  closed: boolean;
}

export const PositionSchema = SchemaFactory.createForClass(Position);
