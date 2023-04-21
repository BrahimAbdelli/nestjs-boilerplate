import { ValidateObjectIdPipe } from './../../shared/pipes/validate-object-id.pipe';
import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { AuthMiddleware } from './middleware/authentification.middelware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HttpModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService]
})
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes();
  }
}
