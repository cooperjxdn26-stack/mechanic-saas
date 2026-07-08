import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /*
   * CORS permite que el frontend en Next.js pueda consumir este backend.
   * En desarrollo usamos localhost:3000.
   */
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  /*
   * ValidationPipe activa las validaciones de los DTOs.
   * whitelist elimina campos que no existan en el DTO.
   * forbidNonWhitelisted lanza error si mandan campos no permitidos.
   * transform convierte automáticamente los tipos cuando sea posible.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /*
   * Prefijo global para todas las rutas.
   * Ejemplo: /api/auth/login
   */
  app.setGlobalPrefix('api');

  const port = process.env.APP_PORT || 3001;

  await app.listen(port);

  console.log(`Backend running on http://localhost:${port}/api`);
}

bootstrap();
