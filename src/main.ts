import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/');
  const config = new DocumentBuilder()
    .setTitle('Japan travels')
    .setDescription('Partagez vos souvenirs de voyage, ou préparez le votre !')
    .setVersion('1.0')
    .addTag('Japan')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  app.use(cookieParser());

  await app.listen(8000);
}
bootstrap();
