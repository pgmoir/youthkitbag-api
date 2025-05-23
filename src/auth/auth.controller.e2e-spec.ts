import { JwtService } from '@nestjs/jwt';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { USERS_MODEL } from '../consts/models.const';
import { HashService } from '../services/hash/hash.service';
import { User } from '../users/interfaces/user.interface';
import { UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController (e2e)', () => {
  let controller: AuthController;
  let mongod: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri)],
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        HashService,
        {
          provide: USERS_MODEL,
          useFactory: (connection: Connection) =>
            connection.model<User>('User', UserSchema),
          inject: [getConnectionToken()],
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
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
});
