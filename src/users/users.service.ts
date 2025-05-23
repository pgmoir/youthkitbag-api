import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { HashService } from 'src/services/hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_MODEL') private readonly userModel: Model<User>,
    private hashService: HashService,
  ) {}

  private excludeFields = {
    password: 0,
    passwordLocked: 0,
    passwordAttempts: 0,
    __v: 0,
  };

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashService.hash(createUserDto.password);

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.findOne(user._id as string);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select(this.excludeFields).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select(this.excludeFields)
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { password, ...rest } = updateUserDto;

    let updatePassword = {};
    if (password) {
      const hashedPassword = await this.hashService.hash(password);
      updatePassword = { password: hashedPassword };
    }

    await this.userModel.findByIdAndUpdate(id, {
      ...rest,
      ...updatePassword,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.userModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found to be deleted');
    }

    return { _id: id, isDeleted: true };
  }

  async validatePassword(id: string, password: string) {
    const user = await this.userModel.findById(id).select({ password: 1 });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      _id: id,
      isValid: this.hashService.compare(password, user.password),
    };
  }
}
