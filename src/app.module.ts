import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './modules/category/category.module';
import { devConfig } from './config/dev.config';
import { prodConfig } from './config/prod.config';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [process.env.NODE_ENV == 'DEV' ? devConfig : prodConfig]
    }),
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      entities: ['src/modules/*/**.entity{.ts,.js}'],
      synchronize: false,
      logger: 'advanced-console',
      useUnifiedTopology: true,
      autoLoadEntities: true
    }),

    UsersModule,
    CategoryModule
  ],
  controllers: [],
  providers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
