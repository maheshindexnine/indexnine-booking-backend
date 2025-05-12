// src/event-schedule/dto/create-event-schedule.dto.ts
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class SeatTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;
}

export class CreateEventScheduleDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  eventId: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SeatTypeDto)
  seatTypes: SeatTypeDto[];
}
