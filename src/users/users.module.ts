import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HashModule } from '../services/hash/hash.module';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, HashModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
