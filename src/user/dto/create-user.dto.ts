import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;
}
