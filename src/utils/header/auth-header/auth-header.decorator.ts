import { SetMetadata } from '@nestjs/common';

export const AuthHeader = (auth: string) => SetMetadata('auth-header', auth);
