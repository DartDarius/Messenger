import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  subscribes: string[];
}

export class AuthSocketDto {
  @ApiProperty()
  name: string;
}
