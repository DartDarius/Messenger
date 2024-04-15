import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { MessageDBModule } from './message.db';
import {
  defaultText,
  defaultMessage,
  updateMessage,
  messageId,
} from './helpers/message.fixtures';
import { RedisModule } from '../redis.module';

describe('MessageService', () => {
  let service: MessageService;

  async function createMessageAndGetId(messageDto = defaultMessage()) {
    const createdMessage = await service.create(messageDto);
    return createdMessage._id.toString();
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MessageDBModule, RedisModule],
      providers: [MessageService],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a message', async () => {
    const createMessageDto = defaultMessage();
    const createMessage = await service.create(createMessageDto);
    expect(createMessage).toBeDefined();
    expect(createMessage.creator).toBeDefined();
  });

  afterEach(async () => {
    await service.deleteMessageByText(defaultText);
  });

  it('should return all messages', async () => {
    const messages = await service.findAll();
    expect(messages).toBeInstanceOf(Array);
  });

  it('should return a message by id', async () => {
    const messageDto = defaultMessage();
    const messageById = await createMessageAndGetId(messageDto);
    const result = await service.findOne(messageById);
    expect(result).toBeDefined();
  });

  it('should update message by id', async () => {
    const messageDto = defaultMessage();
    const messageById = await createMessageAndGetId(messageDto);
    const message = await service.update(messageById, updateMessage());
    expect(message?.text).toBeTruthy();
  });

  it('should delete a message by id', async () => {
    const message = messageId;
    const result = await service.remove(message);
    expect(result).toBeDefined();
  });
});
