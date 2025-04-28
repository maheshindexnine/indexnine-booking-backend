// src/event-seat/dto/create-event-seat.dto.ts
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class BookEventSeatDto {
  @IsMongoId()
  id: string;

  @IsMongoId()
  userId: string;

  @IsBoolean()
  booked: boolean;
}
