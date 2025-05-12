import { IsOptional, IsMongoId, IsString, IsDateString } from 'class-validator';

export class EventScheduleQueryDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsMongoId()
  companyId?: string;

  @IsOptional()
  @IsMongoId()
  eventId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
