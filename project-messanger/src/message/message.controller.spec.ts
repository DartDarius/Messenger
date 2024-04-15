import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageDBModule } from './message.db';
import {
  defaultMessage,
  messageId,
  messageTest,
  removeMessage,
} from './helpers/message.fixtures';
import { RedisModule } from '../redis.module';

describe('MessageController', () => {
  let controller: MessageController;
  let service: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MessageDBModule, RedisModule],
      controllers: [MessageController],
      providers: [MessageService],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a message by id', async () => {
      const id = messageId;
      const message = messageTest();
      jest.spyOn(service, 'findOne').mockImplementation(async () => message);
      expect(await controller.findOne(id)).toBe(message);
    });
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
      const result = [defaultMessage(), messageTest()];
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);
      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const message = messageTest();
      jest.spyOn(service, 'create').mockImplementation(async () => message);
      expect(await controller.create(message)).toBe(message);
    });
  });

  describe('update Message by Id', () => {
    it('should update a message by Id', async () => {
      const id = messageId;
      const message = messageTest();
      jest.spyOn(service, 'update').mockImplementation(async () => message);
      expect(await controller.update(id, message as any)).toBe(message);
    });
  });

  describe('delete Message by Id', () => {
    it('should delete message by id', async () => {
      const message = removeMessage();
      jest.spyOn(service, 'remove').mockImplementation(async () => message);
      expect(await controller.remove(message.id)).toBe(message);
    });
  });
});
