import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 設置全局前綴
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT);
}
bootstrap();
