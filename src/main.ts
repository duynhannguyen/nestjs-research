import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './shared/config';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptors';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ field không được khai báo DTO,
      forbidNonWhitelisted: true, // Nếu có field không được khai báo DTO sẽ báo lối
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      }, // Tự động chuyển đổi dữ liệu sang kiểu được khai báo trong DTO
      exceptionFactory: (validationErrors) => {
        console.log('validationErrors', validationErrors);
        return new UnprocessableEntityException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints as any).join(' '),
          })),
        );
      },
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
