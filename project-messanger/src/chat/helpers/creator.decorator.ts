import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ChatCreatorGuard } from './creator.guard';

export const CREATOR_CHAT = 'Creator of Chat';
export const CreatorChatGuard = () => {
  return applyDecorators(
    SetMetadata(CreatorChatGuard, true),
    UseGuards(ChatCreatorGuard),
  );
};
