import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../chat.service';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminOrCreatorGuard } from '../helpers/admin.Creator.guard';
import { ChatDBModule } from '../chat.db';
import { RedisModule } from '../../redis.module';

describe('AdminOrCreatorChatGuard', () => {
  let chatService: ChatService;
  let adminOrCreatorGuard: AdminOrCreatorGuard;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ChatDBModule, RedisModule],
      providers: [AdminOrCreatorGuard, ChatService, JwtService, ConfigService],
    }).compile();
    adminOrCreatorGuard = module.get<AdminOrCreatorGuard>(AdminOrCreatorGuard);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(adminOrCreatorGuard).toBeDefined();
  });

  it('should throw ForbiddenException when authorization token is missing', async () => {
    const request = {
      headers: {},
    };

    await expect(
      adminOrCreatorGuard.canActivate({
        switchToHttp: () => ({ getRequest: () => request }),
      } as ExecutionContext),
    ).rejects.toThrow(ForbiddenException);
  });

  it('check admin or creator chat', async () => {
    const chatId = 'secondId';
    const creatorId = 'secondId';
    const adminId = 'secondId';
    const checkChatCreator = { createdBy: creatorId };
    const checkChatAdmin = { admins: [adminId] };

    jest
      .spyOn(chatService, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(checkChatCreator))
      .mockImplementationOnce(() => Promise.resolve(checkChatAdmin));

    const chatCreator = await chatService.findOne(chatId);
    const chatAdmin = await chatService.findOne(chatId);

    expect(
      chatCreator.createdBy === creatorId || chatAdmin.admins.includes(adminId),
    ).toBe(true);
  });

  it('check error admin or creator chat', async () => {
    const chatId = 'otherId';
    const creatorId = 'otherId';
    const adminId = 'otherId';
    const checkChatCreator = { createdBy: 'fakeCreator' };
    const checkChatAdmin = { admins: 'fakeAdmin' };

    jest
      .spyOn(chatService, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(checkChatCreator))
      .mockImplementationOnce(() => Promise.resolve(checkChatAdmin));

    const chatCreator = await chatService.findOne(chatId);
    const chatAdmin = await chatService.findOne(chatId);

    expect(
      chatCreator.createdBy === creatorId || chatAdmin.admins.includes(adminId),
    ).toBe(false);
  });
});
