import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log', 'fatal'],
  });
  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      port: 6379,
    },
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Messenger API')
    .addBearerAuth()
    .addOAuth2()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
