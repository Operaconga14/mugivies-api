import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService instance
  const configService = app.get(ConfigService);

  // Retrieve global prefix and port from environment variables
  const globalPrefix = configService.get<string>('GLOBAL_PREFIX') || 'api/v1';
  const PORT = configService.get<number>('PORT') || 3001;

  // Set global prefix for all routes
  app.setGlobalPrefix(globalPrefix);

  // Use Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // SWAGGER SETUP (if needed)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mugivies API')
    .setDescription('API documentation for Mugivies application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  // Start the application
  await app.listen(PORT);
  console.info(
    `Application is running on: http://localhost:${PORT}/${globalPrefix}`,
  );
  console.info(`Swagger Doc is running at http://localhost:${PORT}/docs`);
}
bootstrap();
