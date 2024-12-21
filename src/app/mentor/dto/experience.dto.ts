import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { employmentType } from 'src/schemas/index';

class Position {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsOptional()
  endDate: string;

  @IsBoolean()
  @IsNotEmpty()
  currentlyEmployed: boolean;
}

export class ExperienceMentorDto {
  userId: string;
  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Position)
  @IsNotEmpty()
  positions: Position[];

  @IsEnum(employmentType)
  @IsNotEmpty()
  employmentType: employmentType;

  @IsArray()
  @IsNotEmpty()
  skills: string[];
}
export class UpdateExperienceMentorDto {
  userId: string;
  @IsString()
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  company: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Position)
  @IsOptional()
  positions: Position[];

  @IsEnum(employmentType)
  @IsOptional()
  employmentType: employmentType;

  @IsArray()
  @IsOptional()
  skills: string[];
}
