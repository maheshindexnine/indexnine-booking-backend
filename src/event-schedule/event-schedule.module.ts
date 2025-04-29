// src/event-schedule/event-schedule.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventScheduleService } from './event-schedule.service';
import { EventScheduleController } from './event-schedule.controller';
import {
  EventSchedule,
  EventScheduleSchema,
} from './schemas/event-schedule.schema';
import { User, UserSchema } from '../user/schemas/user.schema'; // User schema
import { Company, CompanySchema } from '../company/schemas/company.schema'; // Company schema
import { EventSeatModule } from 'src/event-seat/event-seat.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EventSchedule.name, schema: EventScheduleSchema },
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
    ...getKafkaClientModule(),
    EventSeatModule,
  ],
  controllers: [EventScheduleController],
  providers: [EventScheduleService],
})
export class EventScheduleModule {}

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
