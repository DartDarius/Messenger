import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { PollingController } from './polling.controller';
import { RedisModule } from '../redis.module';
import { PollingGateway } from './polling.gateway';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [RedisModule, ConfigModule.forRoot()],
  controllers: [PollingController],
  providers: [PollingService, PollingGateway, ConfigService],
})
export class PollingModule {}
