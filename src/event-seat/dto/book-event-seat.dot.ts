// src/event-seat/dto/create-event-seat.dto.ts
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

export class BookEventSeatDto {
  @IsNotEmpty()
  @IsArray()
  ids: string[];

  @IsBoolean()
  booked: boolean;
}
