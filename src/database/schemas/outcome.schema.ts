import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type OutcomeDocument = mongoose.HydratedDocument<Outcome>;

@Schema({ timestamps: true })
export class Outcome {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true })
  event: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  name: string; // "YES", "NO", or "Team A"

  @Prop({ default: 0 })
  totalStakeMicros: number;

  @Prop({ default: 0 })
  price: number; // e.g. 0.45 = 45%

  @Prop({ default: 0 })
  impliedOdds: number; // derived metric

  @Prop({ default: 0 })
  participantCount: number;
}

export const OutcomeSchema = SchemaFactory.createForClass(Outcome);
