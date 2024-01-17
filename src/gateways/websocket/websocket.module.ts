import { Module } from '@nestjs/common';
import { BaseWebsocketGateway } from './websocket.gateway';
import { PublicGatewayController } from './controller/public/public.gateway.controller';
import { PrivateGatewayController } from './controller/public/private.gateway.controller';

@Module({
  providers: [BaseWebsocketGateway],
  exports: [],
})
export class WebsocketModule {}
