import { ValidateObjectIdPipe } from './../../shared/pipes/validateObjectId.pipe';
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HttpModule],
  controllers: [UsersController],
  providers: [UserService]
})
export class UsersModule {}
