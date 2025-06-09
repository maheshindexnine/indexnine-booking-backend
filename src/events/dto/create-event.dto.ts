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

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  genre: string[];

  @IsNumber()
  @IsNotEmpty()
  rating: number;

  @IsNotEmpty()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}
