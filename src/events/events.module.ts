// src/event-seat/event.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsController } from './events.controller';
import { ConfigModule } from '@nestjs/config';
import { getKafkaClientModule } from 'src/kafka/kafka-client.util';
import { Event, EventSchema } from './schemas/events.schema';
import { EventService } from './events.service';
import { User, UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ...getKafkaClientModule(),
  ],
  controllers: [EventsController],
  providers: [EventService],
  exports: [EventService],
})
export class EventsModule {}
