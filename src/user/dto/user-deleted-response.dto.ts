import { ApiProperty } from '@nestjs/swagger';

export class UserDeletedResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  isDeleted: boolean;
}
