import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { AuthMiddleware } from './middleware/authentification.middelware';
import { UsersController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService]
})
export class UsersModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: 'users', method: RequestMethod.GET },
      { path: 'user/*', method: RequestMethod.GET },
      { path: 'user/*', method: RequestMethod.DELETE },
      { path: 'user/*', method: RequestMethod.PUT }
      // { path: 'user', method: RequestMethod.POST }
    );
  }
}
