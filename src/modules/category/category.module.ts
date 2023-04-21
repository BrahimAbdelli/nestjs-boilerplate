import { AuthMiddleware } from '../users/middleware/authentification.middelware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { UsersModule } from '../users/users.module';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), UsersModule],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes
      /*       { path: 'categories/*', method: RequestMethod.DELETE },
      { path: 'categories/*', method: RequestMethod.PUT },
      { path: 'categories', method: RequestMethod.GET },
      { path: 'categories/*', method: RequestMethod.GET },
      { path: 'categories/*', method: RequestMethod.PATCH } */
      ();
  }
}
