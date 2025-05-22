import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDeletedResponseDto } from './dto/user-deleted-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserValidatedResponseDto } from './dto/user-validated-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    type: UserResponseDto,
    description: 'User created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({
    type: [UserResponseDto],
    description: 'Users found',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get('check/:id/:password')
  @ApiOkResponse({
    type: UserValidatedResponseDto,
    description: 'User password validated',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  async checkPassword(
    @Param('id') id: string,
    @Param('password') password: string,
  ) {
    return this.userService.validatePassword(id, password);
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto, description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ type: UserResponseDto, description: 'User updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserDeletedResponseDto, description: 'User deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
