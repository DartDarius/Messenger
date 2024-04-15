import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { CreatorMessageGuard } from './creatorMessage.guard';

export const CREATOR_MESSAGE = 'Creator of message';
export const CreatorMessage = () => {
  return applyDecorators(
    SetMetadata(CREATOR_MESSAGE, true),
    UseGuards(CreatorMessageGuard),
  );
};
