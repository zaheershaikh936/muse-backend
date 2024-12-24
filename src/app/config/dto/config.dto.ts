import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  flag: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
