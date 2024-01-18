import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'warn'],
  });

  app.useWebSocketAdapter(new WsAdapter(app));
  try {
    await socketStart(app);
  } catch (error) {
    console.log(`wait for 3 second to start again`);

    await socketStart(app);
  }
}

async function socketStart(app: any) {
  await app.listen(3000);
}

bootstrap();
