import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatDBModule } from './chat.db';
import { RedisModule } from '../redis.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [ChatDBModule, RedisModule],
  controllers: [ChatController],
  providers: [ChatService, ConfigService, JwtService],
})
export class ChatModule {}
