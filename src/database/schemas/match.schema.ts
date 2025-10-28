import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MatchDocument = mongoose.HydratedDocument<Match>;

export enum MatchOutcome {
  HOME_WIN = 'HOME_WIN',
  DRAW = 'DRAW',
  AWAY_WIN = 'AWAY_WIN',
}

export enum MatchStatus {
  PENDING = 'pending',
  LIVE = 'live',
  ENDED = 'ended',
}

export type Team = {
  name: string;
  key: number;
};

@Schema({ timestamps: true })
export class Match {
  @Prop({ required: true })
  matchKey: string;

  @Prop({ required: true })
  leagueKey: string;

  @Prop({ type: Object, required: true })
  homeTeam: Team;

  @Prop({ type: Object, required: true })
  awayTeam: Team;

  @Prop()
  startTime: Date;

  @Prop({ enum: MatchStatus, default: MatchStatus.PENDING })
  status: MatchStatus;

  @Prop({ default: 0 })
  homeScore: number;

  @Prop({ default: 0 })
  awayScore: number;

  @Prop({ enum: MatchOutcome, required: false })
  finalOutcome?: MatchOutcome;
}

export const MatchSchema = SchemaFactory.createForClass(Match);
