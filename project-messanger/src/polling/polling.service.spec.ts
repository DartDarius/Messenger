import { Test, TestingModule } from '@nestjs/testing';
import { PollingService } from './polling.service';
import { RedisModule } from '../redis.module';
import { ConfigService } from '@nestjs/config';

describe('PollingService', () => {
  let service: PollingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [PollingService, ConfigService],
    }).compile();

    service = module.get<PollingService>(PollingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
