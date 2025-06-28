import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateSupportDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @IsNotEmpty()
  enquiryType: {
    booking: boolean;
    mentor: boolean;
    account: boolean;
    other: boolean;
  };
}
