import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ValidationPipe } from './shared/pipes';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true
  });
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Nestjs Boilerplate')
    .setDescription('This is a project aimed to be a nestjs boilerplate')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  //app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
