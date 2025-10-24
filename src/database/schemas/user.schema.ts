import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ unique: true })
  chatId: number;

  @Prop()
  username: string;

  @Prop()
  svmWalletAddress: string;

  @Prop()
  svmWalletDetails: string;

  @Prop()
  referralCode: string;

  @Prop({ default: false })
  acceptedDiscalimer: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
