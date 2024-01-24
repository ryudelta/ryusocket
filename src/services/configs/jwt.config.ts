import { env } from 'node:process';

import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  key: env.JWT_KEY ?? '',
  algorithm: env.ALGORITHM ?? '',
}));