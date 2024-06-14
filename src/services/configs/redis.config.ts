import { env } from 'node:process';

import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: env.REDIS_URL ?? 'localhost',
  port: env.REDIS_PORT ?? 'localhost',
}));