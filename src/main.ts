import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from './shared/pipes';

import * as compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { join } from 'path';
import * as favicon from 'serve-favicon';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Nestjs Boilerplate')
    .setDescription('This is a project aimed to be a nestjs boilerplate')
    .setVersion('1.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  //app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    compression(),
    helmet(),
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000 // limit each IP to 100 requests per windowMs
    }),
    favicon(join(__dirname, '..', 'public', 'favicon.ico'))
  );
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
