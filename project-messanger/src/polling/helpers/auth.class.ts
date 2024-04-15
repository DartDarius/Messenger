import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  user: JwtPayload & { chats: string[] };
}

export interface JwtPayload {
  userId: string;
  name: string;
}
