import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so the frontend (e.g., Next.js dev server on http://localhost:3000) can call the API
  // For development, this is permissive. In production, set FRONTEND_ORIGIN to a comma-separated list of allowed origins.
  const origins = process.env.FRONTEND_ORIGIN?.split(',').map(s => s.trim()).filter(Boolean) as string[] | undefined;
  app.enableCors({
    origin: origins && origins.length > 0 ? origins : true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
