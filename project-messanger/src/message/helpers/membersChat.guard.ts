import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
  ForbiddenException,
} from '@nestjs/common';
import { MessageService } from '../message.service';

@Injectable()
export class MembersGuard implements CanActivate {
  constructor(private readonly messageService: MessageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new ForbiddenException('You are do not have token and access');
    }
    const { chatId } = request.params;

    const userId = await this.messageService.handleGetUserId(token);
    const chat = await this.messageService.handleGetAllChatUsers(chatId);

    if (chat.includes(userId)) {
      return true;
    }
    throw new UnauthorizedException('You are not a member of this chat');
  }
}
