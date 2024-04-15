import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty()
  text: string;
  @ApiProperty()
  creator: string;
  @ApiProperty()
  chat: string;
  @ApiProperty()
  created?: Date;
  @IsDateString()
  @ApiProperty()
  scheduled?: Date;
}
