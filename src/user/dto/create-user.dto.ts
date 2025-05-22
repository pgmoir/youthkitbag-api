import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { patterns } from 'src/utils/patterns.util';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(patterns.password, {
    message:
      'password must be at least 8 characters and include at least one lowercase character, one uppercase character, one number and one special character',
  })
  @ApiProperty()
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly postcode?: string;
}
