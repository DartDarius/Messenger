import { Test, TestingModule } from '@nestjs/testing';
import { PollingController } from './polling.controller';
import { PollingService } from './polling.service';
import { RedisModule } from '../redis.module';
import { ConfigService } from '@nestjs/config';

describe('PollingController', () => {
  let controller: PollingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      controllers: [PollingController],
      providers: [PollingService, ConfigService],
    }).compile();

    controller = module.get<PollingController>(PollingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
