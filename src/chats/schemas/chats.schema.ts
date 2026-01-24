import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IChatMessage } from './chats.type';

export type ChatsDocument = Chats & Document;

@Schema({ collection: 'chatmessages', timestamps: true })
export class Chats implements IChatMessage {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true })
  from: string;

  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String, required: true })
  msg: string;

  @Prop({ type: Number })
  updatedAt: number;

  @Prop({ type: Number })
  createdAt: number;
}

export const ChatsSchema = SchemaFactory.createForClass(Chats);
