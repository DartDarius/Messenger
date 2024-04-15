import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../redis.module';
import { StoryDBModule } from './story.db';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guards and decorators/jwt.strategy';

@Module({
  imports: [
    StoryDBModule,
    RedisModule,
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule,
  ],
  controllers: [StoryController],
  providers: [StoryService, ConfigService, JwtService, JwtStrategy],
})
export class StoryModule {}
