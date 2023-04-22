import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './modules/category/category.module';
import { devConfig } from './config/dev.config';
import { prodConfig } from './config/prod.config';

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
export class AppModule {}
