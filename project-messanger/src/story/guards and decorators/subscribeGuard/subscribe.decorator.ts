import { SetMetadata } from '@nestjs/common';
import { Subscribe } from '../../helpers/subscribe.enum';

export const SUBSCRIBES_KEY = 'subscribe';
export const Subscribes = (...subscribes: Subscribe[]) =>
  SetMetadata(SUBSCRIBES_KEY, subscribes);
