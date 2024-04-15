import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger/dist';
import { AuthDto, AuthSocketDto } from './dto/auth.dto';
import { Public } from '../helpers/public.decorator';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('auth-check')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  async login(@Body() authDto: AuthDto) {
    const token = this.authService.generateToken(authDto);
    return token;
  }

  @Post('/tokenForSocket')
  async tokenSocket(@Body() authSocketDto: AuthSocketDto) {
    const tokenSocket = this.authService.generateTokenForSocket(authSocketDto);
    return tokenSocket;
  }

  @Post('sendLink')
  sendLink(@Body() authDto: AuthDto) {
    const link = this.authService.sendLink(authDto);
    return link;
  }

  @MessagePattern({ cmd: 'getUserIdFromToken' })
  async handleGetUserIdFromToken(token: string) {
    return await this.authService.getUserIdFromToken(token);
  }
}
