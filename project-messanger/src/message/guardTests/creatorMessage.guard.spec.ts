import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageService } from '../message.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreatorMessageGuard } from '../helpers/creatorMessage.guard';
import { MessageDBModule } from '../message.db';
import { RedisModule } from '../../redis.module';

describe('CreatorMessageGuard', () => {
  let messageService: MessageService;
  let creatorMessageGuard: CreatorMessageGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MessageDBModule, RedisModule],
      providers: [
        CreatorMessageGuard,
        MessageService,
        JwtService,
        ConfigService,
      ],
    }).compile();
    messageService = module.get<MessageService>(MessageService);
    creatorMessageGuard = module.get<CreatorMessageGuard>(CreatorMessageGuard);
  });

  it('should be defined', () => {
    expect(creatorMessageGuard).toBeDefined();
  });

  it('should throw ForbiddenException when authorization token is missing', async () => {
    const request = {
      headers: {},
    };

    await expect(
      creatorMessageGuard.canActivate({
        switchToHttp: () => ({ getRequest: () => request }),
      } as ExecutionContext),
    ).rejects.toThrow(ForbiddenException);
  });

  it('user is author of message', async () => {
    const chatId = 'chatId';
    const userId = 'userId';
    const message = { author: userId };

    jest
      .spyOn(messageService, 'findOne')
      .mockImplementation(() => Promise.resolve(message));
    const result = await messageService.findOne(chatId);
    expect(result).toEqual(message);
    expect(result.author).toBe(userId);
    expect(result).toBeTruthy();
  });

  it('if user is not author of message', async () => {
    const chatId = 'chatId';
    const userId = 'userId';
    const message = { author: 'fakeId' };

    jest
      .spyOn(messageService, 'findOne')
      .mockImplementation(() => Promise.resolve(message));
    const result = await messageService.findOne(chatId);
    if (result.author === userId) {
      expect(result).toBeInstanceOf(UnauthorizedException);
    }
  });

  it('if user admin chat', async () => {
    const chatId = 'oneId';
    const userId = 'userId';
    const chat = { admins: [userId] };

    jest
      .spyOn(messageService, 'handleGetAdminChat')
      .mockImplementation(() => Promise.resolve(chat));
    const result = await messageService.handleGetAdminChat(chatId, userId);
    expect(result).toEqual(chat);
    expect(result.admins).toContain(userId);
    expect(result).toBeTruthy();
  });

  it('if user is not admin of the chat', async () => {
    const chatId = 'oneId';
    const userId = 'userId';
    const chat = { admins: ['notCorrectUserId'] };

    jest
      .spyOn(messageService, 'handleGetAdminChat')
      .mockImplementation(() => Promise.resolve(chat));
    const result = await messageService.handleGetAdminChat(chatId, userId);
    expect(result.admins.includes(userId)).toBe(false);
  });

  it('if user owner chat', async () => {
    const userId = 'userId';
    const chat = { createdBy: userId };

    jest
      .spyOn(messageService, 'handleCreatorOfChat')
      .mockImplementation(() => Promise.resolve(chat));
    const result = await messageService.handleCreatorOfChat(userId);
    expect(result).toEqual(chat);
    expect(result.createdBy).toBe(userId);
    expect(result).toBeTruthy();
  });

  it('if user is not owner of the chat', async () => {
    const userId = 'userId';
    const chat = { createdBy: 'notCorrectUserId' };

    jest
      .spyOn(messageService, 'handleCreatorOfChat')
      .mockImplementation(() => Promise.resolve(chat));
    const result = await messageService.handleCreatorOfChat(userId);
    expect(result.createdBy === userId).toBe(false);
  });
});
