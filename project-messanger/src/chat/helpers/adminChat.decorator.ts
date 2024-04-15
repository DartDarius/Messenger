import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminOrCreatorGuard } from './admin.Creator.guard';

export const ADMIN_CHAT = 'Admin for Chat';
export const AdminOrCreatorChat = () => {
  return applyDecorators(
    SetMetadata(AdminOrCreatorChat, true),
    UseGuards(AdminOrCreatorGuard),
  );
};
