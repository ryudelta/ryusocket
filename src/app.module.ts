import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingMiddleware } from '@utils/logging/logging.middleware';
import { WebsocketModule } from '@gateways/websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
