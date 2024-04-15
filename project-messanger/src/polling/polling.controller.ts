import { Controller } from '@nestjs/common';
import { PollingService } from './polling.service';
import { EventPattern } from '@nestjs/microservices';
import { eventName } from '../helpers/event.enum';
import { Message } from '../message/message.schema';
import { CreateMessageDto } from '../message/dto/create-message.dto';

@Controller('polling')
export class PollingController {
  constructor(private readonly pollingService: PollingService) {}

  @EventPattern(eventName.messageCreated)
  handleSendMessage(message: Message) {
    this.pollingService.handleSendMessage(message);
  }

  @EventPattern(eventName.updatedReadOfMessage)
  readMessage(message: Message) {
    this.pollingService.sendReadMessage(message);
  }

  @EventPattern(eventName.message_sent)
  async sendPendingMessage(message: CreateMessageDto) {
    return this.pollingService.scheduleMessage(message);
  }
}
