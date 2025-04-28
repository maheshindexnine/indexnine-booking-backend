import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Connect Kafka Microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'indexnine-booking-consumer',
      },
    },
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);

  console.log('🚀 HTTP Server + Kafka Microservice started');
}
bootstrap();
