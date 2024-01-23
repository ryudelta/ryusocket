import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from '@services/configs/rabbitmq.config';
import { RabbitmqService } from '@services/rabbitmq/rabbitmq.service';
import { WebsocketModule } from '@services/service.module';
import { LoggingMiddleware } from '@utils/logging/logging.middleware';

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
