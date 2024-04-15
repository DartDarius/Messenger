import { ApiProperty } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty()
  info: string;
  @ApiProperty()
  author: string;
  @ApiProperty()
  createdAt: Date;
}
