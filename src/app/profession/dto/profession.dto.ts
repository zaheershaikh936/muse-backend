import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProfessionDto {
  @IsNumber()
  @IsNotEmpty()
  sort: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}
