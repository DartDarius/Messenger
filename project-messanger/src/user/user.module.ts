import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserDBModule } from './user.db';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisModule } from '../redis.module';

@Module({
  imports: [UserDBModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, ConfigService, JwtService],
})
export class UserModule {}
