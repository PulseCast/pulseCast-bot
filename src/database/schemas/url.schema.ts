import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UrlDocument = mongoose.HydratedDocument<Url>;

@Schema({ timestamps: true })
export class Url {
  @Prop({ required: true })
  ticker: string;

  @Prop({ required: true })
  url: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
