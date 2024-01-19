import { Module } from '@nestjs/common';
import { BaseWebsocketGateway } from './websocket.gateway';
import { PublicGatewayController } from './controller/public.gateway.controller';
import { PrivateGatewayController } from './controller/private.gateway.controller';
import { WebsocketService } from './services/websocket/websocket.service';

@Module({
  providers: [
    BaseWebsocketGateway,
    PublicGatewayController,
    PrivateGatewayController,
    WebsocketService,
  ],
  exports: [],
})
export class WebsocketModule {}
