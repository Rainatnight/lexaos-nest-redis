import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FolderType } from './folders.type';

export type FolderDocument = Folder & Document;

@Schema({
  collection: 'folders',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Folder implements FolderType {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, required: true })
  type: 'pc' | 'vs' | 'bin' | 'folder' | string;

  @Prop({ type: String, default: null })
  parentId: string;

  @Prop({ type: Number, required: true })
  x: number;

  @Prop({ type: Number, required: true })
  y: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  content?: string;

  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
