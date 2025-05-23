import { NotFoundException } from '@nestjs/common';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import { USERS_MODEL } from '../consts/models.const';
import { HashService } from '../services/hash/hash.service';
import { expectNoProperty } from '../utils/test-helpers.util';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('UserService (e2e)', () => {
  let module: TestingModule;
  let service: UsersService;
  let mongod: MongoMemoryServer;
  let connection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri)],
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

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(USERS_MODEL);
    connection = userModel.db;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and return it', async () => {
    const dto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Smith',
      password: 'abCD12£$',
      email: 'johnSmith@test.co',
    };
    const result = await service.create(dto);

    expect(result).toHaveProperty('_id');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Smith');
    expect(result.email).toBe('johnsmith@test.co');
    expect(result).toHaveProperty('createdAt');
    expectNoProperty(result, 'password');
  });

  it('should return a user by id', async () => {
    const created = await service.create({
      firstName: 'John',
      lastName: 'Smith',
      password: 'abCD12£$',
      email: 'johnSmith@test.co',
    });
    const result = await service.findOne(created._id);

    expect(result.email).toBe('johnsmith@test.co');
  });

  it('should throw NotFoundException if user not found', async () => {
    await expect(service.findOne('000000000000000000000000')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a user', async () => {
    const created = await service.create({
      firstName: 'John',
      lastName: 'Smith',
      password: 'abCD12£$',
      email: 'johnSmith@test.co',
    });
    const updated = await service.update(created._id, {
      email: 'johnSmith@test.co.uk',
    });

    expect(updated.email).toBe('johnsmith@test.co.uk');
  });
});
