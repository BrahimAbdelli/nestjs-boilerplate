import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../users/middleware/authentification.middelware';
import { UsersModule } from '../users/users.module';
import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), UsersModule],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      //We should append the 'api' from the global prefix because nest still
      //doesn't take it in consideration when excluding
      .exclude({ path: 'api/products/search', method: RequestMethod.GET })
      .forRoutes(
        { path: 'products/*', method: RequestMethod.DELETE },
        { path: 'products/*', method: RequestMethod.PUT },
        { path: 'products', method: RequestMethod.GET },
        { path: 'products/*', method: RequestMethod.GET },
        { path: 'products/*', method: RequestMethod.PATCH },
        { path: 'products', method: RequestMethod.POST }
      );
  }
}
