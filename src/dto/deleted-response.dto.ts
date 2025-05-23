import { ApiProperty } from '@nestjs/swagger';

export class DeletedResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  isDeleted: boolean;
}
