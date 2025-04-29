// src/event-schedule/event-schedule.module.ts
import { DynamicModule, Module, Provider } from '@nestjs/common';
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
import { KafkaMockClient } from 'src/kafka/kafka.mock';
import { getKafkaClientModule } from 'src/kafka/kafka-client.util';

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
