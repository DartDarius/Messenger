import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { REDIS_SERVICE } from '../redis.module';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Subject, lastValueFrom } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { eventName } from '../helpers/event.enum';
import { AuthSocket, JwtPayload } from './helpers/auth.class';
import { ERROR_MESSAGE } from '../helpers/constants';
import { Read } from '../helpers/exportsConstructions';
import { Message } from '../message/message.schema';
import * as schedule from 'node-schedule';

@Injectable()
export class PollingService {
  private readonly logger = new Logger(PollingService.name);
  private gatewayEvents = new Subject<{ event: string; data: any }>();
  constructor(
    @Inject(REDIS_SERVICE) private redisClient: ClientProxy,
    private configService: ConfigService,
  ) {}

  handleSendMessage(message: Message) {
    this.gatewayEvents.next({ event: eventName.message, data: message });
  }

  handleMessage(message: CreateMessageDto, chats: string[]) {
    const { chat } = message;
    const accessUser = chats.includes(chat);
    if (accessUser) {
      return this.redisClient.emit(eventName.messageReceived, message);
    } else {
      throw new ForbiddenException(ERROR_MESSAGE.ACCESS_ERROR);
    }
  }

  handleConnection(token: string) {
    const secret = this.configService.get<string>('JWT_SECRET')!;
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  }

  async getChatsFromUser(userId: string) {
    const requestUserChat = this.redisClient.send({ cmd: 'getUser' }, userId);
    return await lastValueFrom(requestUserChat);
  }

  async updatedMessageRead(Read: Read) {
    this.redisClient.emit(eventName.READ, Read);
  }

  sendReadMessage(message: Message) {
    this.gatewayEvents.next({ event: eventName.READ, data: message });
  }

  getEvents() {
    return this.gatewayEvents;
  }

  joinedUserToChat(client: AuthSocket, chats: string[]) {
    if (chats) {
      chats.forEach((chat) => {
        this.logger.log('Add user in room', chat);
        client.join(chat);
      });
    }
  }

  handlePendingMessage(message: CreateMessageDto, clientChats: string[]) {
    const { chat } = message;
    const chatAccess = clientChats.includes(chat);
    if (!chatAccess) {
      throw new ForbiddenException('you do not have access');
    }
    this.redisClient.emit(eventName.message_schedule, message);
  }

  scheduleMessage(message: CreateMessageDto) {
    const { scheduled } = message;
    if (!scheduled) {
      throw new Error('Scheduled date is required');
    }
    const delay = new Date(scheduled);
    const job = schedule.scheduleJob(delay, async () => {
      this.handleSendMessage(message);
    });
    return job;
  }
}
