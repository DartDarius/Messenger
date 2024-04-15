import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PollingService } from './polling.service';
import { AuthSocket, JwtPayload } from './helpers/auth.class';
import { CreateMessageDto } from '../message/dto/create-message.dto';
import { eventName } from '../helpers/event.enum';
import { Read } from 'src/helpers/exportsConstructions';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class PollingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PollingGateway.name);
  @WebSocketServer() server: Server;
  constructor(private readonly pollingService: PollingService) {}

  afterInit(server: Server) {
    console.log('Websocket Gateway initialized');
    this.pollingService.getEvents().subscribe({
      next: ({ event, data }) => {
        if (data.chat) {
          server.to(data.chat).emit(event, data);
        }
      },
    });
  }

  async handleConnection(client: AuthSocket) {
    // const token = client.handshake.auth.token;
    const token = client.handshake.headers.authorization as string;
    try {
      const user = this.pollingService.handleConnection(token) as JwtPayload & {
        chats: string[];
      };
      const chatsUser = await this.pollingService.getChatsFromUser(user.userId);
      user.chats = chatsUser;
      client.user = user;
      this.pollingService.joinedUserToChat(client, user.chats);
      console.log(chatsUser);
    } catch (e) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(eventName.message)
  handleMessage(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() message: CreateMessageDto,
  ) {
    this.logger.log('This is user', client.user);
    const user = client.user.chats;
    this.logger.log(user);
    this.pollingService.handleMessage(message, user);
  }

  @SubscribeMessage(eventName.READ)
  handleSeen(@MessageBody() read: Read) {
    this.pollingService.updatedMessageRead(read);
  }

  @SubscribeMessage(eventName.message_schedule)
  handleMessagePending(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() data: CreateMessageDto,
  ) {
    console.log('message from', client.user);
    const clientChats = client.user.chats;
    this.pollingService.handlePendingMessage(data, clientChats);
  }

  @SubscribeMessage('ping')
  handlePing() {
    return {
      event: 'pong',
      data: 'pong data',
    };
  }
}
