import { ApiProperty } from '@nestjs/swagger';

export class UserValidatedResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  isValid: boolean;
}
