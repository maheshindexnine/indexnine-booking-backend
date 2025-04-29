// src/event-seat/event-seat.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSeatService } from './event-seat.service';
import { EventSeatController } from './event-seat.controller';
import { EventSeat, EventSeatSchema } from './schemas/event-seat.schema';
import { Company, CompanySchema } from '../company/schemas/company.schema'; // Company schema
import {
  EventSchedule,
  EventScheduleSchema,
} from '../event-schedule/schemas/event-schedule.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: EventSeat.name, schema: EventSeatSchema },
      { name: Company.name, schema: CompanySchema },
      { name: EventSchedule.name, schema: EventScheduleSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ...getKafkaClientModule(),
  ],
  controllers: [EventSeatController],
  providers: [EventSeatService],
  exports: [EventSeatService],
})
export class EventSeatModule {}

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
            clientId: 'indexnine-booking-client',
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
