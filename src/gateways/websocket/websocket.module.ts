import { Module } from '@nestjs/common';
import { BaseWebsocketGateway } from './websocket.gateway';
import { PublicGatewayController } from './controller/public.gateway.controller';
import { PrivateGatewayController } from './controller/private.gateway.controller';
import { SocketPath } from '@utils/header';
import { WebsocketService } from './services/websocket/websocket.service';

@Module({
  providers: [
    BaseWebsocketGateway,
    PublicGatewayController,
    PrivateGatewayController,
    {
      provide: SocketPath,
      useValue: (path: string) => SocketPath(path),
    },
    WebsocketService,
  ],
  exports: [],
})
export class WebsocketModule {}
