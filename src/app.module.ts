import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServiceModule } from '@services/service.module';
import { LoggingMiddleware } from '@utils/logging/logging.middleware';

@Module({
  imports: [ServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
