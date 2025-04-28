// src/event-seat/dto/update-event-seat.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventSeatDto } from './create-event-seat.dto';
import { IsMongoId } from 'class-validator';

export class UpdateEventSeatDto extends PartialType(CreateEventSeatDto) {
  @IsMongoId()
  userId: string;
}
