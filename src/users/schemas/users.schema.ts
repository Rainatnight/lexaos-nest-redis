import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserType } from './users.type';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User implements UserType {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Number })
  updatedAt: number;

  @Prop({ type: Number })
  createdAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
