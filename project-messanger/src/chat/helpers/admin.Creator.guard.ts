import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
  ForbiddenException,
} from '@nestjs/common';
import { ChatService } from '../chat.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export const ROLES_KEY = 'roles';

@Injectable()
export class AdminOrCreatorGuard implements CanActivate {
  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new ForbiddenException('User do not have access');
    }
    const { chatId } = request.params;

    const userId = await this.getUserIdFromToken(token);
    const chat = await this.chatService.findOne(chatId);
    const user = { chatId, userId };
    const admin = await this.chatService.checkChatsAmin(user);

    if (userId === chat.createdBy || admin) {
      return true;
    }
    throw new UnauthorizedException('You do not have a necessary access');
  }

  getUserIdFromToken(_id: string) {
    const secret = this.configService.get('JWT_SALT');
    const decodedToken = this.jwtService.verify(_id, { secret });
    console.log(decodedToken);
    return decodedToken._id;
  }
}
