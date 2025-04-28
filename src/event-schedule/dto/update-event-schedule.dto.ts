// src/event-schedule/dto/update-event-schedule.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventScheduleDto } from './create-event-schedule.dto';

export class UpdateEventScheduleDto extends PartialType(
  CreateEventScheduleDto,
) {}
