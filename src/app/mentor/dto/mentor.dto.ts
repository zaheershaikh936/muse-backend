import { IsNumber, IsOptional } from 'class-validator';

export class GetMentorDto {
  @IsOptional()
  filter: any;

  @IsNumber()
  @IsOptional()
  limit: number;

  @IsNumber()
  @IsOptional()
  page: number;

  @IsOptional()
  filed: any;

  @IsOptional()
  sort: any;
}
