import { env } from 'node:process';

import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  host: env.RABBITMQ_HOST ?? 'localhost',
  port: env.RABBITMQ_PORT ?? 5672,
  user: env.RABBITMQ_USER ?? 'guest',
  pass: env.RABBITMQ_PASS ?? 'guest',
  exName: env.EXCHANGE_NAME ?? 'ngrocket.event.solo',
}));