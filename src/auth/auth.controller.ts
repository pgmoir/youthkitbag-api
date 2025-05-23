import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/logIn.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  logIn(@Body() logInDto: LogInDto) {
    return this.authService.logIn(logInDto.email, logInDto.password);
  }
}
