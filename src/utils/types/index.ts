import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
  user?: any;
}


export interface TimeSlotT {
  day: number;
  dayString: string;
  startTime: string;
  endTime: string;
  status: boolean;
  _id?: string;
}

export interface AvailabilityT {
  [key: string]: TimeSlotT[];
}