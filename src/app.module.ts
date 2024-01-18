import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from '@utils/logging/logging.middleware';
import { WebsocketModule } from '@gateways/websocket/websocket.module';
import { BaseWebsocketGateway } from '@gateways/websocket/websocket.gateway';
import { PublicGatewayController } from '@gateways/websocket/controller/public.gateway.controller';
import { PrivateGatewayController } from '@gateways/websocket/controller/private.gateway.controller';
import { SocketPath } from '@utils/header';
import { WebsocketService } from '@gateways/websocket/services/websocket/websocket.service';

@Module({
  imports: [WebsocketModule],
  controllers: [],
  providers: [
    BaseWebsocketGateway,
    PublicGatewayController,
    PrivateGatewayController,
    WebsocketService,
    {
      provide: SocketPath,
      useValue: (path: string) => SocketPath(path),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
