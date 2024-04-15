import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { EventPattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { eventName } from '../helpers/event.enum';
import { CreatorMessage } from './helpers/creatorMessage.decorator';
import { IsMember } from './helpers/memberChats.decorator';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @EventPattern(eventName.messageReceived)
  async handleCreateMessage(message: CreateMessageDto) {
    await this.messageService.create(message);
  }

  @EventPattern(eventName.READ)
  async updateField(Read: { chatId: string; messageId: string }) {
    await this.messageService.handleMessageRead(Read);
  }

  @EventPattern(eventName.message_schedule)
  async handleCreateSchedule(message: CreateMessageDto) {
    const createMessage = await this.messageService.create(message);
    this.messageService.handleCreateSchedule(createMessage);
  }

  @CreatorMessage()
  @Delete(':messageId')
  removeMessage(@Param('messageId') messageId: string) {
    return this.messageService.remove(messageId);
  }

  @IsMember()
  @Get(':chatId/history')
  async getHistory(@Param('chatId') chatId: string) {
    return await this.messageService.getMessagesHistory(chatId);
  }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }
}
