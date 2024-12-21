import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Location {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  flag: string;

  @IsString()
  @IsOptional()
  iso2: string;
}

class Profession {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  _id: string;
}

export class Role {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsOptional()
  name: string;
}

export class CreateProfileDTO {
  @IsObject()
  @ValidateNested()
  @Type(() => Location)
  @IsNotEmpty()
  location: Location;

  @IsObject()
  @ValidateNested()
  @Type(() => Profession)
  @IsNotEmpty()
  profession: Profession;

  @IsObject()
  @ValidateNested()
  @Type(() => Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  bio: string;

  userId: string;
}

export class UpdateAboutDTO {
  @IsString()
  @IsNotEmpty()
  about: string;

  userId: string;
}

export class UpdateSkillsDTO {
  @IsArray()
  @IsNotEmpty()
  skills: string[];

  userId: string;
}

export class UpdateBannerDTO {
  @IsString()
  @IsNotEmpty()
  bgImage: string[];

  userId: string;
}
