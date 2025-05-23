import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { KITBAGS_MODEL } from '../consts/models.const';
import { SpaceService } from '../services/space/space.service';
import { CreateKitbagDto } from './dto/create-kitbag.dto';
import { UpdateKitbagDto } from './dto/update-kitbag.dto';
import { Kitbag } from './interfaces/kitbag.interface';

@Injectable()
export class KitbagsService {
  constructor(
    @Inject(KITBAGS_MODEL) private readonly kitbagModel: Model<Kitbag>,
    private spaceService: SpaceService,
  ) {}

  async create(
    createKitbagDto: CreateKitbagDto,
    creator: string,
  ): Promise<Kitbag> {
    const space = this.spaceService.convert(createKitbagDto.name);

    const kitbag = await this.kitbagModel.create({
      ...createKitbagDto,
      space,
      creator,
    });

    return this.findOne(kitbag._id, creator);
  }

  async findAll(creator: string): Promise<Kitbag[]> {
    return this.kitbagModel.find({ creator }).exec();
  }

  async findOne(id: string, creator: string): Promise<Kitbag> {
    const kitbag = await this.kitbagModel.findById(id).exec();

    if (!kitbag || kitbag.creator.toString() !== creator) {
      throw new NotFoundException('Kitbag not found');
    }

    return kitbag;
  }

  async update(
    id: string,
    updateKitbagDto: UpdateKitbagDto,
    creator: string,
  ): Promise<Kitbag> {
    await this.kitbagModel.findByIdAndUpdate(id, {
      ...updateKitbagDto,
    });

    return this.findOne(id, creator);
  }

  async remove(id: string, creator: string) {
    const result = await this.kitbagModel.deleteOne({ _id: id, creator });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Kitbag not found to be deleted');
    }

    return { _id: id, isDeleted: true };
  }
}
