import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { SubscribeGuard } from './subscribe.guard';
import { StoryDBModule } from '../../story.db';
import { RedisModule } from '../../../redis.module';
import { JwtStrategy } from '../jwt.strategy';
import { ConfigService } from '@nestjs/config';
// import { getMockContext } from './getMockContext';
import { ExecutionContext } from '@nestjs/common';

describe('SubscribeGuard', () => {
  let subscribeGuard: SubscribeGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StoryDBModule, RedisModule],
      providers: [SubscribeGuard, Reflector, JwtStrategy, ConfigService],
    }).compile();

    subscribeGuard = module.get<SubscribeGuard>(SubscribeGuard);
    reflector = module.get<Reflector>(Reflector);
  });
  it('should be defined', () => {
    expect(subscribeGuard).toBeDefined();
  });

  it('should allow access if user has required subscribe', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { subscribes: ['premium'] } }),
      }),
      getHandler: () => {},
      getClass: () => {},
    };
    jest.spyOn(reflector, 'get').mockReturnValue(['premium']);
    await expect(
      subscribeGuard.canActivate(context as ExecutionContext),
    ).toBeTruthy();
  });

  it('should block access if user does not have required subscribe', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { subscribes: ['standard'] } }),
      }),
      getHandler: () => {},
      getClass: () => {},
    };
    jest.spyOn(reflector, 'get').mockImplementation(() => true);
    await expect(
      subscribeGuard.canActivate(context as ExecutionContext),
    ).toBeFalsy();
  });
});
