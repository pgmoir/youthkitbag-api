import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SpaceModule } from '../services/space/space.module';
import { KitbagsController } from './kitbags.controller';
import { kitbagsProviders } from './kitbags.providers';
import { KitbagsService } from './kitbags.service';

@Module({
  imports: [DatabaseModule, SpaceModule],
  controllers: [KitbagsController],
  providers: [KitbagsService, ...kitbagsProviders],
})
export class KitbagsModule {}
