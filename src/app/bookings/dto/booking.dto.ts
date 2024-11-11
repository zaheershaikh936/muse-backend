import { Type } from "class-transformer";
import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

class CommonUserAndMentorDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    image: string;
}

class BookingDto {
    @IsString()
    @IsNotEmpty()
    bookingDate: string;

    @IsString()
    @IsNotEmpty()
    day: string;

    @IsString()
    @IsNotEmpty()
    startTimeString: string;

    @IsString()
    @IsNotEmpty()
    endTimeString: string;

    @IsString()
    @IsNotEmpty()
    startTime: string

    @IsString()
    @IsNotEmpty()
    endTime: string
}

export class CreateBookingDto {
    @IsString()
    @IsOptional()
    userId: string;

    @IsString()
    @IsNotEmpty()
    mentorId: string;

    @IsObject()
    @ValidateNested()
    @Type(() => CommonUserAndMentorDto)
    @IsOptional()
    user: CommonUserAndMentorDto;

    @IsObject()
    @ValidateNested()
    @Type(() => CommonUserAndMentorDto)
    @IsOptional()
    mentor: CommonUserAndMentorDto;

    @IsObject()
    @ValidateNested()
    @Type(() => BookingDto)
    @IsNotEmpty()
    booking: BookingDto;


    @IsString()
    @IsNotEmpty()
    notes: string;


    @IsString()
    @IsNotEmpty()
    amount: string;

}
