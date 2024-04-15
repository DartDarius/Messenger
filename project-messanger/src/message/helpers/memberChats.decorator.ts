import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { MembersGuard } from './membersChat.guard';

export const IS_MEMBERS = 'IsMembers';
export const IsMember = () => {
  return applyDecorators(SetMetadata(IsMember, true), UseGuards(MembersGuard));
};
