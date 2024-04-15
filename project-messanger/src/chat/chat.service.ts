import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Connection } from 'mongoose';
import { Chat, ChatDocument } from './chat.schema';
import { ClientProxy } from '@nestjs/microservices';
import { REDIS_SERVICE } from '../redis.module';
import { UserData } from './helpers/userData.interface';
import { eventName } from '../helpers/event.enum';

@Injectable()
export class ChatService {
  private readonly chatModel;
  constructor(
    @InjectConnection('chat') private readonly connection: Connection,
    @Inject(REDIS_SERVICE) private redisClient: ClientProxy,
  ) {
    this.chatModel = this.connection.model<ChatDocument>(Chat.name);
  }
  async create(createChatDto: CreateChatDto, user: string) {
    const createdChat = new this.chatModel({
      ...createChatDto,
      createdBy: user,
    });
    return createdChat.save();
  }

  async findAll() {
    return await this.chatModel.find();
  }

  async findOne(id: string) {
    const chat = await this.chatModel.findById(id);
    if (!chat) {
      throw new NotFoundException();
    }
    return chat;
  }

  async update(id: string, updateChatDto: UpdateChatDto) {
    const chat = await this.chatModel.findByIdAndUpdate(id, updateChatDto, {
      new: true,
    });
    if (!chat) {
      throw new NotFoundException();
    }
    return chat;
  }

  async remove(chatId: string) {
    return await this.chatModel.findByIdAndDelete(chatId);
  }

  async deleteChatByTitle(title: string) {
    return await this.chatModel.deleteMany({ title });
  }

  async getUserInChats(id: string) {
    const chats = await this.chatModel
      .find({ members: id })
      .select('_id')
      .exec();
    const chatId = chats.map((chat) => chat._id.toString());
    return chatId;
  }

  async addUMemberInChat(user: UserData) {
    const updateUser = this.chatModel.findByIdAndUpdate(
      user.chatId,
      {
        $addToSet: { members: user.userId },
      },
      { new: true },
    );
    const { userId } = user;
    this.redisClient.emit(eventName.memberJoined, userId);
    return updateUser;
  }

  async removeMemberInChat(user: UserData) {
    const updateUser = this.chatModel.findByIdAndUpdate(
      user.chatId,
      {
        $pull: { members: user.userId },
      },
      { new: true },
    );
    const { userId } = user;
    this.redisClient.emit(eventName.memberLeft, userId);
    return updateUser;
  }

  async getCreatorOfChat(userId: string) {
    const creator = await this.chatModel
      .findOne({ createdBy: userId })
      .select('createdBy')
      .exec();
    if (creator?.createdBy) {
      return creator?.createdBy;
    } else {
      return false;
    }
  }

  async checkChatsAmin(user: { chatId: string; userId: string }) {
    const { chatId, userId } = user;
    const chat = await this.chatModel
      .findOne({ _id: chatId, admins: userId })
      .exec();
    return chat !== null;
  }

  async appointUserToAdmin(user: UserData) {
    const findUser = this.chatModel.find({ members: user.userId }).select('id');
    if (!findUser) {
      const addAdmin = this.chatModel.findByIdAndUpdate(
        user.chatId,
        {
          $addToSet: { admins: user.userId },
        },
        { new: true },
      );
      return addAdmin;
    }
    const deleteFromMembersAndAddAdmins = this.chatModel.findByIdAndUpdate(
      user.chatId,
      {
        $pull: { members: user.userId },
        $addToSet: { admins: user.userId },
      },
      { new: true },
    );
    return deleteFromMembersAndAddAdmins;
  }

  async removeAdminInChat(user: UserData) {
    const deleteAdmin = this.chatModel.findByIdAndUpdate(
      user.chatId,
      {
        $pull: { admins: user.userId },
      },
      { new: true },
    );
    return deleteAdmin;
  }

  async findUserInChat(chatId: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) {
      throw new BadRequestException();
    }
    const user = chat.members;
    console.log(user);
    return user;
  }
}
