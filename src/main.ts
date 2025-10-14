import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.use(['/'], bodyParser.raw({ type: 'application/json' }));
  app.use(bodyParser.json());

  await app.listen(4242);
}
bootstrap();