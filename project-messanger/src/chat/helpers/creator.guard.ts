import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
  ForbiddenException,
} from '@nestjs/common';
import { ChatService } from '../chat.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatCreatorGuard implements CanActivate {
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new ForbiddenException('User do not have access');
    }

    const userId = this.getUserIdFromToken(token);

    const { chatId } = request.params;

    const chat = await this.chatService.findOne(chatId);
    if (userId === chat.createdBy) {
      return true;
    } else {
      throw new UnauthorizedException('You are not a creator of chat');
    }
  }

  getUserIdFromToken(_id: string) {
    const secret = this.configService.get('JWT_SALT');
    const decodedToken = this.jwtService.verify(_id, { secret });
    return decodedToken._id;
  }
}
