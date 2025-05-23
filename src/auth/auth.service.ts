import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async logIn(email: string, password: string): Promise<any> {
    const result = await this.usersService.validatePassword(email, password);

    if (!result.isValid) {
      throw new UnauthorizedException('User cannot be authorized');
    }

    return this.usersService.findOne(result._id);
  }
}
