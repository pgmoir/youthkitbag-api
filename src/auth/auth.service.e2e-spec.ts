import { JwtService } from '@nestjs/jwt';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';
import { USERS_MODEL } from '../consts/models.const';
import { HashService } from '../services/hash/hash.service';
import { User } from '../users/interfaces/user.interface';
import { UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService (e2e)', () => {
  let module: TestingModule;
  let service: AuthService;
  let mongod: MongoMemoryServer;
  let connection: Connection;
  let userModel: Model<User>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri)],
      providers: [
        AuthService,
        UsersService,
        HashService,
        JwtService,
        {
          provide: USERS_MODEL,
          useFactory: (connection: Connection) =>
            connection.model<User>('User', UserSchema),
          inject: [getConnectionToken()],
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
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
});
