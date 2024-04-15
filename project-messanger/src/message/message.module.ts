import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageDBModule } from './message.db';
import { RedisModule } from '../redis.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MessageDBModule, RedisModule],
  controllers: [MessageController],
  providers: [MessageService, ConfigService, JwtService],
})
export class MessageModule {}
