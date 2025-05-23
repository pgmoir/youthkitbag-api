import { ApiProperty } from '@nestjs/swagger';

export class KitbagResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  space: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  activitys?: string[];

  // @ApiProperty()
  // creator: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
