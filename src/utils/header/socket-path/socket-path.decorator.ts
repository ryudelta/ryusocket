import { SetMetadata } from '@nestjs/common';

export const SocketPath = (path: string) => SetMetadata('socket-path', [path]);
