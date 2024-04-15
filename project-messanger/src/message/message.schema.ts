import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  text: string;

  @Prop()
  creator: string;

  @Prop()
  chat: string;

  @Prop({ default: Date.now() })
  created?: Date;

  @Prop({ default: null })
  read?: Date;

  @Prop({ default: null })
  scheduled?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
