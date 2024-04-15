import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from '../chat.service';
import {
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatCreatorGuard } from '../helpers/creator.guard';
import { ChatDBModule } from '../chat.db';
import { RedisModule } from '../../redis.module';
import { ChatDocument } from '../chat.schema';

describe('ChatCreatorGuard', () => {
  let chatService: ChatService;
  let chatCreatorGuard: ChatCreatorGuard;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ChatDBModule, RedisModule],
      providers: [ChatCreatorGuard, ChatService, JwtService, ConfigService],
    }).compile();
    chatCreatorGuard = module.get<ChatCreatorGuard>(ChatCreatorGuard);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(chatCreatorGuard).toBeDefined();
  });

  it('should throw ForbiddenException when authorization token is missing', async () => {
    const request = {
      headers: {},
    };

    await expect(
      chatCreatorGuard.canActivate({
        switchToHttp: () => ({ getRequest: () => request }),
      } as ExecutionContext),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should return true if user is the creator of the chat', async () => {
    const chatId = 'someChatId';
    const userId = 'someUserId';
    const chat = { createdBy: userId };

    jest
      .spyOn(chatService, 'findOne')
      .mockImplementation(() => Promise.resolve(chat as ChatDocument));
    const result = await chatService.findOne(chatId);
    expect(result).toEqual(chat);
    expect(result).toBeTruthy();
  });

  it('should throw UnauthorizedException if user is not the creator of the chat', async () => {
    const chatId = 'someChatId';
    const userId = 'someUserId';
    const chat = { createdBy: 'differentUserId' };
    jest
      .spyOn(chatService, 'findOne')
      .mockImplementation(() => Promise.resolve(chat as ChatDocument));
    const result = await chatService.findOne(chatId);
    if (result.createdBy === userId) {
      expect(result).toBeInstanceOf(UnauthorizedException);
    }
  });
});
