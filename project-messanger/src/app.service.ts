import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REDIS_SERVICE } from './redis.module';

@Injectable()
export class AppService {
  constructor(@Inject(REDIS_SERVICE) private redisClient: ClientProxy) {}
  async getUserById(id: string) {
    return this.redisClient.send({ cmd: 'get' }, id);
  }
  getHello(): string {
    return 'Hello World!';
  }

  async getAllChats() {
    return this.redisClient.send({ cmd: 'get' }, 'all');
  }
}
