import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  members: string[];
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  admins?: string[];
}
