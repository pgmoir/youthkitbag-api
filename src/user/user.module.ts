import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { HashModule } from 'src/services/hash/hash.module';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, HashModule],
  controllers: [UserController],
  providers: [UserService, ...userProviders],
})
export class UserModule {}
