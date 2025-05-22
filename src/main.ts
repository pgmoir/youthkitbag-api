import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Youthkitbag API')
    .setDescription('Authenticated backend for Youthkitbag Application')
    .setVersion('1.0.0')
    .build();
  const documentOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, documentOptions);
  const customOptions: SwaggerCustomOptions = {
    explorer: false,
  };
  SwaggerModule.setup('api', app, documentFactory, customOptions);

  app.enableCors();
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  console.log('PORT', process.env.PORT);
  const port = (process.env.PORT || configService.get<number>('PORT')) ?? 3000;

  await app.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port: ${port}`);
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
