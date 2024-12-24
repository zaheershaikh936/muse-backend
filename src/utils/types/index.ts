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


export interface PaymentCreateOrderResT {
  id: string
  purchase_units: PurchaseUnit[]
  create_time: string
  links: Link[]
}

export interface PurchaseUnit {
  reference_id: string
  amount: Amount
}

export interface Amount {
  currency_code: string
  value: string
}

export interface Link {
  href: string
  rel: string
  method: string
}
