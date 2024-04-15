import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatDBModule } from './chat.db';
import {
  chatId,
  chatTest,
  defaultChat,
  removeChat,
} from './helpers/chat.fixtures';
import { RedisModule } from '../redis.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ChatDocument } from './chat.schema';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ChatDBModule, RedisModule],
      controllers: [ChatController],
      providers: [ChatService, JwtService, ConfigService],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a chat by id', async () => {
      const id = chatId;
      const chat = chatTest;
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(async () => chat as ChatDocument);
      expect(await controller.findOne(id)).toBe(chat);
    });
  });

  describe('findAll', () => {
    it('should return all chats', async () => {
      const result = [defaultChat(), chatTest];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(async () => result as [ChatDocument]);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('create Chat', () => {
    it('should create a new chat', async () => {
      const chat = chatTest;
      jest
        .spyOn(service, 'create')
        .mockImplementation(async (chat) => chat as ChatDocument);
      expect(await controller.create(chat, {})).toBe(chat);
    });
  });

  describe('delete chat by Id', () => {
    it('should delete a chat by ID', async () => {
      const chat = removeChat();
      jest
        .spyOn(service, 'remove')
        .mockImplementation(async () => chat as ChatDocument);
      expect(await controller.remove(chat.id)).toEqual(chat);
    });
  });
});
