import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMailDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class SendUserWelcomeDto extends CreateMailDto {}
