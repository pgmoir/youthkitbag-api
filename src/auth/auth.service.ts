import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async logIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const result = await this.usersService.validatePassword(email, password);

    if (!result.isValid) {
      throw new UnauthorizedException('User cannot be authorized');
    }

    const user = await this.usersService.findOne(result._id);

    const payload = { _id: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.create({
      lastName,
      firstName,
      email,
      password,
    });

    const payload = { _id: user._id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
