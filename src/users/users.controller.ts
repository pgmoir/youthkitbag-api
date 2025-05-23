import { Body, Controller, Get, Patch, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserId } from '../decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  @ApiOkResponse({ type: UserResponseDto, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  findOne(@UserId() userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch('')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto, description: 'User updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  update(
    @UserId() userId: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }
}
