import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model } from 'mongoose';

import { NotFoundException } from '@nestjs/common';
import { KITBAGS_MODEL } from '../consts/models.const';
import { SpaceService } from '../services/space/space.service';
import { CreateKitbagDto } from './dto/create-kitbag.dto';
import { Kitbag } from './interfaces/kitbag.interface';
import { KitbagsService } from './kitbags.service';
import { KitbagSchema } from './schemas/kitbag.schema'; // Adjust path as needed

describe('KitbagsService (e2e)', () => {
  let module: TestingModule;
  let service: KitbagsService;
  let mongod: MongoMemoryServer;
  let connection: Connection;
  let kitbagModel: Model<Kitbag>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri)],
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

    service = module.get<KitbagsService>(KitbagsService);
    kitbagModel = module.get<Model<Kitbag>>(KITBAGS_MODEL);
    connection = kitbagModel.db;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    await kitbagModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a kitbag and return it', async () => {
    const dto: CreateKitbagDto = { name: 'My Kitbag' };
    const result = await service.create(dto);

    expect(result).toHaveProperty('_id');
    expect(result.name).toBe('My Kitbag');
    expect(result.space).toBe('mykitbag');
  });

  it('should return all kitbags', async () => {
    await service.create({ name: 'First' });
    await service.create({ name: 'Second' });

    const result = await service.findAll();
    expect(result.length).toBe(2);
  });

  it('should return a kitbag by id', async () => {
    const created = await service.create({ name: 'Lookup Bag' });
    const result = await service.findOne(created._id);

    expect(result.name).toBe('Lookup Bag');
  });

  it('should throw NotFoundException if kitbag not found', async () => {
    await expect(service.findOne('000000000000000000000000')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a kitbag', async () => {
    const created = await service.create({ name: 'To Update' });
    const updated = await service.update(created._id, {
      name: 'Updated Bag',
    });

    expect(updated.name).toBe('Updated Bag');
  });

  it('should delete a kitbag', async () => {
    const created = await service.create({ name: 'To Delete' });
    const result = await service.remove(created._id);

    expect(result).toEqual({ _id: created._id, isDeleted: true });
  });

  it('should throw NotFoundException if delete fails', async () => {
    await expect(service.remove('000000000000000000000000')).rejects.toThrow(
      NotFoundException,
    );
  });
});
