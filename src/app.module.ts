import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { EventScheduleModule } from './event-schedule/event-schedule.module';
import { EventSeatModule } from './event-seat/event-seat.module';
import { KafkaController } from './kafka/kafka.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    ...getKafkaClientModule(),
    UserModule,
    CompanyModule,
    EventScheduleModule,
    EventSeatModule,
  ],
  controllers: [
    AppController,
    ...(process.env.ENABLE_KAFKA === 'true' ? [KafkaController] : []),
  ],
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

function getKafkaClientModule(): DynamicModule[] {
  const enableKafka = process.env.ENABLE_KAFKA === 'true';

  if (!enableKafka) {
    console.log('❌ Kafka is disabled.');
    return [];
  }

  console.log('✅ Kafka is enabled.');
  return [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
          },
          consumer: {
            groupId: process.env.KAFKA_GROUP_ID || 'indexnine-booking-consumer',
          },
        },
      },
    ]),
  ];
}
