import { Module } from '@nestjs/common';
import { BaseWebsocketGateway } from './websocket/websocket.gateway';
import { PublicGatewayController } from './websocket/controller/public.gateway.controller';
import { PrivateGatewayController } from './websocket/controller/private.gateway.controller';
import { WebsocketService } from './websocket/services/websocket/websocket.service';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from './configs/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        rabbitmqConfig,
      ],
    })
  ],
  providers: [
    BaseWebsocketGateway,
    PublicGatewayController,
    PrivateGatewayController,
    WebsocketService,
    RabbitmqService,
  ],
  exports: [],
})
export class WebsocketModule {}
