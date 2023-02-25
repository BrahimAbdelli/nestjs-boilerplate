import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
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

    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
