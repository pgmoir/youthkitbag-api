import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { HashModule } from 'src/services/hash/hash.module';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, HashModule],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
})
export class UsersModule {}
