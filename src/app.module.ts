import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BaseWebsocketGateway } from '@gateways/websocket/websocket.gateway';
import { LoggingMiddleware } from '@utils/logging/logging.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [BaseWebsocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
