import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { CompanyModule } from './company/company.module';
import { EventScheduleModule } from './event-schedule/event-schedule.module';
import { EventSeatModule } from './event-seat/event-seat.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';
import { KafkaController } from './kafka/kafka.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes env config available everywhere
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    UserModule,
    CompanyModule,
    EventScheduleModule,
    EventSeatModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'indexnine-booking-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController, KafkaController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
