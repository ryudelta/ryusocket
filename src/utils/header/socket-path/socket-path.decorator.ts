import { SetMetadata } from '@nestjs/common';

export const SocketPath = (path: string) => SetMetadata('path', path);
