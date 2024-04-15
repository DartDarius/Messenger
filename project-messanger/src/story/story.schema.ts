import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StoryDocument = HydratedDocument<Story>;

@Schema()
export class Story {
  @Prop()
  info: string;

  @Prop()
  author: string;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const StorySchema = SchemaFactory.createForClass(Story);
