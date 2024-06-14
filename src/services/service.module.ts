import { Module } from '@nestjs/common';
import { BaseWebsocketGateway } from './websocket/websocket.gateway';
import { PublicGatewayController } from './websocket/controller/public.gateway.controller';
import { PrivateGatewayController } from './websocket/controller/private.gateway.controller';
import { WebsocketService } from './websocket/services/websocket/websocket.service';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from './configs/rabbitmq.config';
import { KeyUtils } from '@utils/key/key.jwt';
import { RedisService } from './redis/redis.service';
import jwtConfig from './configs/jwt.config';
import redisConfig from './configs/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        rabbitmqConfig,
        redisConfig,
        jwtConfig
      ],
    })
  ],
  providers: [
    BaseWebsocketGateway,
    PublicGatewayController,
    PrivateGatewayController,
    WebsocketService,
    RabbitmqService,
    KeyUtils,
    RedisService
  ],
  exports: [],
})
export class ServiceModule {}
