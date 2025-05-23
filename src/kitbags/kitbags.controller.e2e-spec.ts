import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';

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
    const dto: CreateKitbagDto = { name: 'My Kitbag' };
    const result = await controller.create(dto);

    expect(result).toHaveProperty('_id');
    expect(result.name).toBe('My Kitbag');
    expect(result.space).toBe('mykitbag');
    expect(result).toHaveProperty('createdAt');
  });

  it('should return all kitbags', async () => {
    await controller.create({ name: 'First' });
    await controller.create({ name: 'Second' });

    const result = await controller.findAll();
    expect(result.length).toBe(2);
  });

  it('should return a kitbag by id', async () => {
    const created = await controller.create({ name: 'Lookup Bag' });
    const result = await controller.findOne(created._id);

    expect(result.name).toBe('Lookup Bag');
  });

  it('should throw NotFoundException if kitbag not found', async () => {
    await expect(
      controller.findOne('000000000000000000000000'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update a kitbag', async () => {
    const created = await controller.create({ name: 'To Update' });
    const updated = await controller.update(created._id, {
      name: 'Updated Bag',
    });

    expect(updated.name).toBe('Updated Bag');
  });

  it('should delete a kitbag', async () => {
    const created = await controller.create({ name: 'To Delete' });
    const result = await controller.remove(created._id);

    expect(result).toEqual({ _id: created._id, isDeleted: true });
  });

  it('should throw NotFoundException if delete fails', async () => {
    await expect(controller.remove('000000000000000000000000')).rejects.toThrow(
      NotFoundException,
    );
  });
});
