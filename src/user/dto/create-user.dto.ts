import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { patterns } from 'src/utils/patterns.util';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(patterns.password, {
    message:
      'Password must be at least 8 characters and include at least one lowercase character, one uppercase character, one number and one special character',
  })
  password: string;

  @IsString()
  postcode: string;
}
