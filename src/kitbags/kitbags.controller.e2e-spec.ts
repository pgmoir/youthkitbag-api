import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Types } from 'mongoose';

import { NotFoundException } from '@nestjs/common';
import { KITBAGS_MODEL } from '../consts/models.const';
import { SpaceService } from '../services/space/space.service';
import { CreateKitbagDto } from './dto/create-kitbag.dto';
import { Kitbag } from './interfaces/kitbag.interface';
import { KitbagsController } from './kitbags.controller';
import { KitbagsService } from './kitbags.service';
import { KitbagSchema } from './schemas/kitbag.schema';

describe('KitbagsController (e2e)', () => {
  let controller: KitbagsController;
  let mongod: MongoMemoryServer;
  let connection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri)],
      controllers: [KitbagsController],
      providers: [
        KitbagsService,
        SpaceService,
        {
          provide: KITBAGS_MODEL,
          useFactory: (connection: Connection) =>
            connection.model<Kitbag>('Kitbag', KitbagSchema),
          inject: [getConnectionToken()],
        },
      ],
    }).compile();

    controller = module.get<KitbagsController>(KitbagsController);
    connection = module.get(getConnectionToken());
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const model = connection.model('Kitbag');
    await model.deleteMany({});
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a kitbag and return it', async () => {
    const userId = new Types.ObjectId().toString();
    const dto: CreateKitbagDto = { name: 'My Kitbag' };
    const result = await controller.create(userId, dto);

    expect(result).toHaveProperty('_id');
    expect(result.name).toBe('My Kitbag');
    expect(result.space).toBe('mykitbag');
    expect(result).toHaveProperty('createdAt');
  });

  it('should return all kitbags', async () => {
    const userId = new Types.ObjectId().toString();
    await controller.create(userId, { name: 'First' });
    await controller.create(userId, { name: 'Second' });

    const otherUserId = new Types.ObjectId().toString();
    await controller.create(otherUserId, { name: 'Third' });
    await controller.create(otherUserId, { name: 'Fourth' });

    const result = await controller.findAll(userId);
    expect(result.length).toBe(2);
  });

  it('should return a kitbag by id', async () => {
    const userId = new Types.ObjectId().toString();
    const created = await controller.create(userId, { name: 'Lookup Bag' });
    const result = await controller.findOne(userId, created._id);

    expect(result.name).toBe('Lookup Bag');
  });

  it('should throw NotFoundException if kitbag not found', async () => {
    const userId = new Types.ObjectId().toString();
    await expect(
      controller.findOne(userId, '000000000000000000000000'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update a kitbag', async () => {
    const userId = new Types.ObjectId().toString();
    const created = await controller.create(userId, { name: 'To Update' });
    const updated = await controller.update(userId, created._id, {
      name: 'Updated Bag',
    });

    expect(updated.name).toBe('Updated Bag');
  });

  it('should delete a kitbag', async () => {
    const userId = new Types.ObjectId().toString();
    const created = await controller.create(userId, { name: 'To Delete' });
    const result = await controller.remove(userId, created._id);

    expect(result).toEqual({ _id: created._id, isDeleted: true });
  });

  it('should throw NotFoundException if delete fails', async () => {
    const userId = new Types.ObjectId().toString();
    await expect(
      controller.remove(userId, '000000000000000000000000'),
    ).rejects.toThrow(NotFoundException);
  });
});
