import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MatchDocument = mongoose.HydratedDocument<Match>;

export enum Outcome {
  HOME_WIN = 'HOME',
  DRAW = 'DRAW',
  AWAY_WIN = 'AWAY',
}

export enum MatchStatus {
  PRE = 'pre',
  LIVE = 'live',
  FINISHED = 'finished',
}

export type Team = {
  name: string;
  key: number;
  init: string;
};

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true })
  matchKey: string;

  @Prop({ type: Object, required: true })
  homeTeam: Team;

  @Prop({ type: Object, required: true })
  awayTeam: Team;

  @Prop()
  startTime: Date;

  @Prop({ enum: MatchStatus, default: MatchStatus.PRE })
  status: MatchStatus;

  @Prop({ default: 0 })
  homeScore: number;

  @Prop({ default: 0 })
  awayScore: number;

  @Prop({ enum: Outcome, required: false })
  finalOutcome?: Outcome;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
