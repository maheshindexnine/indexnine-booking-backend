// src/event-seat/dto/create-event-seat.dto.ts
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateEventSeatDto {
  @IsMongoId()
  vendorId: string;

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  eventScheduleId: string;
  
  @IsMongoId()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  seatNo: string;

  @IsString()
  @IsNotEmpty()
  row: string;

  @IsString()
  @IsNotEmpty()
  seatName: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  color: string;
}
