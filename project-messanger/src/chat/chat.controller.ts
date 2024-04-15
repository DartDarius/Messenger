import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ApiTags } from '@nestjs/swagger';
import { MessagePattern } from '@nestjs/microservices';
import { CreatorChatGuard } from './helpers/creator.decorator';
import { AdminOrCreatorChat } from './helpers/adminChat.decorator';
import { UserData } from './helpers/userData.interface';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto, @Request() req: any) {
    const { user } = req;
    return await this.chatService.create(createChatDto, user);
  }

  @MessagePattern({ cmd: 'getUser' })
  checkMessage(id: string) {
    return this.chatService.getUserInChats(id);
  }

  @MessagePattern({ cmd: 'getCreator' })
  handleGetOwnerChat(userId: string) {
    return this.chatService.getCreatorOfChat(userId);
  }

  @Post('addMember')
  async addMember(@Body() user: UserData) {
    return await this.chatService.addUMemberInChat(user);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get('id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @CreatorChatGuard()
  @Post(':chatId/admin')
  async promoteUser(@Body() user: UserData) {
    return await this.chatService.appointUserToAdmin(user);
  }

  @CreatorChatGuard()
  @Delete(':chatId')
  remove(@Param('chatId') chatId: string) {
    return this.chatService.remove(chatId);
  }

  @Patch(':id')
  async update(
    @Param('chatId') id: string,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    console.log(id);
    return this.chatService.update(id, updateChatDto);
  }

  @AdminOrCreatorChat()
  @Post(':chatId/user')
  async addUserInChat(@Body() user: UserData) {
    return await this.chatService.addUMemberInChat(user);
  }

  @AdminOrCreatorChat()
  @Delete(':chatId/user')
  async removeUserInChat(@Body() user: UserData) {
    return await this.chatService.removeMemberInChat(user);
  }

  @MessagePattern({ cmd: 'checked Admin' })
  handleGetAdminChat(user: { chatId: string; userId: string }) {
    return this.chatService.checkChatsAmin(user);
  }

  @MessagePattern({ cmd: 'getAllUsersChats' })
  handleGetUserInChats(chatId: string) {
    return this.chatService.findUserInChat(chatId);
  }
}
