import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type EventDocument = mongoose.HydratedDocument<Event>;

export enum EventStatus {
  UPCOMING = 'upcoming',
  OPEN = 'open',
  WAITING = 'waiting', // awaiting enough liquidity
  LIVE = 'live',
  CLOSED = 'closed', // stopped taking bets
  SETTLED = 'settled',
  CANCELLED = 'cancelled',
}
export enum EventSource {
  POLYMARKET = 'polymarket',
  INPLAY = 'inplay',
  CUSTOM = 'custom',
}

export enum EventVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    enum: EventSource,
    default: EventSource.CUSTOM,
  })
  source: EventSource; // polymarket, inplay, custom

  @Prop({ required: true })
  eventId: string; // from external feed

  @Prop({ type: Date })
  startTime?: Date;

  @Prop({ type: Date })
  endTime?: Date;

  @Prop({
    enum: EventStatus,
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @Prop({ type: [String], default: ['YES', 'NO'] })
  outcomes: string[]; // ["YES", "NO"], or ["Team A", "Team B"]

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Outcome', default: [] })
  outcomeRefs?: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: 0 })
  totalLiquidityMicros: number;

  @Prop({ default: 0 })
  totalVolumeMicros: number;

  @Prop()
  marketUrl?: string; // for external link to Polymarket

  @Prop()
  imageUrl?: string;

  @Prop()
  category?: string; // "Sports", "Crypto", "Politics", etc.

  @Prop()
  settledOutcome?: string; // winning outcome

  @Prop({ default: false })
  inPlayEnabled: boolean; // allow live bets

  @Prop({ default: false })
  autoSettled: boolean; // true if connected to oracle or polymarket

  @Prop({ type: Date })
  settledAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: mongoose.Schema.Types.ObjectId;

  @Prop({
    enum: EventVisibility,
    default: EventVisibility.PUBLIC,
  })
  visibility: EventVisibility; // "public" or "private"

  @Prop()
  groupChatId?: string;

  @Prop({ default: false })
  requiresInvite: boolean;

  @Prop()
  inviteCode: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
