import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";


class PersonDetails {
    @IsString()
    name: string;

    @IsString()
    image: string;
}

export class CreateReviewDto {
    @IsString()
    userId: string;

    @IsObject()
    @ValidateNested()
    @Type(() => PersonDetails)
    @IsNotEmpty()
    user: PersonDetails;

    @IsString()
    mentorId: string;

    @IsObject()
    @ValidateNested()
    @Type(() => PersonDetails)
    @IsNotEmpty()
    mentor: PersonDetails;

    @IsNumber()
    @Min(1)
    @Max(5)
    sessionRating: number;

    @IsNotEmpty()
    @IsString()
    comment: string;

    @IsOptional()
    @IsString()
    status?: string;
}
