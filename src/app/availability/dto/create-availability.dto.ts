import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class CreateAvailabilityDto {

  mentor: {
    name: string;
    image: string;
    email: string;
  };

  @IsObject()
  @IsNotEmpty()
  availability: {
    sunday: { day: number, dayString: string; startTime: string; endTime: string, status: boolean; }[];
    monday: { day: number, dayString: string; startTime: string; endTime: string, status: string; }[];
    tuesday: { day: number, dayString: string; startTime: string; endTime: string, status: string; }[];
    wednesday: {
      day: number, dayString: string; startTime: string; endTime: string, status: string;
    }[];
    thursday: {
      day: number,
      dayString: string;
      startTime: string; endTime: string,
      status: string;
    }[];
    friday: { day: number, dayString: string; startTime: string; endTime: string, status: string; _id: string }[];
    saturday: {
      day: number,
      dayString: string;
      startTime: string; endTime: string,
      status: string;
    }[];
  };
  userId: string; // get it from decoded token
  mentorId: string;
}

export class UpdateAvailabilityDto {
  @IsObject()
  @IsOptional()
  availability: {
    sunday?: { day: number, dayString: string; startTime: string; endTime: string, status: boolean; }[];
    monday?: { day: number, dayString: string; startTime: string; endTime: string, status: string; }[];
    tuesday?: { day: number, dayString: string; startTime: string; endTime: string, status: string; }[];
    wednesday?: {
      day: number, dayString: string; startTime: string; endTime: string, status: string;
    }[];
    thursday?: {
      day: number,
      dayString: string;
      startTime: string; endTime: string,
      status: string;
    }[];
    friday?: { day: number, dayString: string; startTime: string; endTime: string, status: string; _id: string }[];
    saturday?: {
      day: number,
      dayString: string;
      startTime: string; endTime: string,
      status: string;
    }[];
  };
}

