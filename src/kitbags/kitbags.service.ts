import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { SpaceService } from 'src/services/space/space.service';
import { CreateKitbagDto } from './dto/create-kitbag.dto';
import { UpdateKitbagDto } from './dto/update-kitbag.dto';
import { Kitbag } from './interfaces/kitbag.interface';

@Injectable()
export class KitbagsService {
  constructor(
    @Inject('KITBAGS_MODEL') private readonly kitbagModel: Model<Kitbag>,
    private spaceService: SpaceService,
  ) {}

  async create(createKitbagDto: CreateKitbagDto): Promise<Kitbag> {
    const space = this.spaceService.convert(createKitbagDto.name);

    const kitbag = await this.kitbagModel.create({
      ...createKitbagDto,
      space,
    });

    return this.findOne(kitbag._id as string);
  }

  async findAll(): Promise<Kitbag[]> {
    return this.kitbagModel.find().exec();
  }

  async findOne(id: string): Promise<Kitbag> {
    const kitbag = await this.kitbagModel.findById(id).exec();

    if (!kitbag) {
      throw new NotFoundException('Kitbag not found');
    }

    return kitbag;
  }

  async update(id: string, updateKitbagDto: UpdateKitbagDto): Promise<Kitbag> {
    await this.kitbagModel.findByIdAndUpdate(id, {
      ...updateKitbagDto,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.kitbagModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Kitbag not found to be deleted');
    }

    return { _id: id, isDeleted: true };
  }
}
