import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsBoolean()
  @IsOptional()
  isMentor: boolean;

  updatedAt: Date;
}

export class SocialAuthDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;
}

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class BecomeMentorUserDto {
  name: string;
  email: string;
  userId: string;
  image: string;
}

export class BecomeMentorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  userId: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  profession: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  flag?: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsObject()
  @ValidateNested()
  @IsOptional()
  @Type(() => BecomeMentorUserDto)
  user: BecomeMentorUserDto;

  ratings: number;
  verified: boolean;

  location: {
    country: string;
    city: string;
    flag?: string;
    iso2?: string;
  };
}
