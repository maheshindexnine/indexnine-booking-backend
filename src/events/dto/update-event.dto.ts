// src/event-seat/dto/update-event-seat.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsMongoId } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
  @IsMongoId()
  userId: string;
}
