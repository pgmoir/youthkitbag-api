import { ApiProperty } from '@nestjs/swagger';

export class ValidResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  isValid: boolean;
}
