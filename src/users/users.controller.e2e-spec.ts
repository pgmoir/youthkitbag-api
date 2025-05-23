import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';

import { NotFoundException } from '@nestjs/common';
import { USERS_MODEL } from '../consts/models.const';
import { HashService } from '../services/hash/hash.service';
import { expectNoProperty } from '../utils/test-helpers.util';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController (e2e)', () => {
  let controller: UsersController;
  let mongod: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri)],
      controllers: [UsersController],
      providers: [
        UsersService,
        HashService,
        {
          provide: USERS_MODEL,
          useFactory: (connection: Connection) =>
            connection.model<User>('User', UserSchema),
          inject: [getConnectionToken()],
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    connection = module.get(getConnectionToken());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const model = connection.model('User');
    await model.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user and return it', async () => {
    const dto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Smith',
      password: 'abCD12£$',
      email: 'johnSmith@test.co',
    };
    const result = await controller.create(dto);

    expect(result).toHaveProperty('_id');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Smith');
    expect(result.email).toBe('johnsmith@test.co');
    expect(result).toHaveProperty('createdAt');
    expectNoProperty(result, 'password');
  });

  it('should return all users', async () => {
    await controller.create({
      firstName: 'John',
      lastName: 'Smith',
      password: 'abCD12£$',
      email: 'johnSmith@test.co',
    });
    await controller.create({
      firstName: 'Jenny',
      lastName: 'brown',
      password: 'lkJH09*&',
      email: 'jennYBROwn@test.co',
    });

    const result = await controller.findAll();
    expect(result.length).toBe(2);
  });

  it('should return a user by id', async () => {
    const created = await controller.create({
      firstName: 'John',
      lastName: 'Smith',
      password: 'abCD12£$',
      email: 'johnSmith@test.co',
    });
    const result = await controller.findOne(created._id);

    expect(result.email).toBe('johnsmith@test.co');
  });

  it('should throw NotFoundException if user not found', async () => {
    await expect(
      controller.findOne('000000000000000000000000'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update a user', async () => {
    const created = await controller.create({
      firstName: 'John',
      lastName: 'Smith',
      password: 'abCD12£$',
      email: 'johnSmith@test.co',
    });
    const updated = await controller.update(created._id, {
      email: 'johnSmith@test.co.uk',
    });

    expect(updated.email).toBe('johnsmith@test.co.uk');
  });

  it('should delete a user', async () => {
    const created = await controller.create({
      firstName: 'John',
      lastName: 'Smith',
      password: 'abCD12£$',
      email: 'johnSmith@test.co',
    });
    const result = await controller.remove(created._id);

    expect(result).toEqual({ _id: created._id, isDeleted: true });
  });

  it('should throw NotFoundException if delete fails', async () => {
    await expect(controller.remove('000000000000000000000000')).rejects.toThrow(
      NotFoundException,
    );
  });
});
