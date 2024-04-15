import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { PollingModule } from './polling/polling.module';
import { RedisModule } from './redis.module';
import { AuthModule } from './auth/auth.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [
    RedisModule,
    UserModule,
    ChatModule,
    MessageModule,
    PollingModule,
    AuthModule,
    StoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
