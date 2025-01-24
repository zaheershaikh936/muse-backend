import { Logger } from '@nestjs/common';
import { toZonedTime } from 'date-fns-tz';

interface BookingStatus {
  booking: boolean; // true if booking is upcoming, false if expired
  status: 'expired' | 'very soon' | 'soon' | 'not today' | 'unknown';
  title: string;
  description: string;
}

export const getBookingStatus = (
  bookingDate: Date,
  startTime: Date,
): BookingStatus => {
  Logger.debug(bookingDate, startTime);
  // const now = new Date();
  // const start = new Date(startTime);

  // const bookingDay = new Date(bookingDate);

  // if (isToday(bookingDay)) {
  //     console.log(start, "start time");
  //     console.log(now, "now time");
  //     const minutesToStart = differenceInMinutes(start, now);
  //     console.log(minutesToStart, "minutesToStart");
  //     if (minutesToStart <= 0) {
  //         return {
  //             booking: false,
  //             status: 'expired',
  //             title: 'Your Session is Expired Today',
  //             description: 'This session has expired today. Please book another session.',
  //         };
  //     }

  //     if (minutesToStart <= 60) {
  //         return {
  //             booking: true,
  //             status: 'very soon',
  //             title: 'Your Session is Starting Soon',
  //             description: 'Your session will start in less than 30 minutes. Get ready!',
  //         };
  //     }

  //     return {
  //         booking: false,
  //         status: 'soon',
  //         title: 'Your Session is Scheduled',
  //         description: 'Your session is coming up, but it will start soon.',
  //     };
  // }

  // if (isPast(bookingDay)) {
  //     return {
  //         booking: false,
  //         status: 'expired',
  //         title: 'Your Session is Expired',
  //         description: 'This session has expired. Please book another session.',
  //     };
  // }

  // if (isFuture(bookingDay)) {
  //     return {
  //         booking: false,
  //         status: 'not today',
  //         title: 'Your Session is Not Today',
  //         description: 'This session is scheduled for another day. Please check the date.',
  //     };
  // }
  return {
    booking: true,
    status: 'very soon',
    title: 'Your Session is Starting Soon',
    description: 'Your session will start in less than 30 minutes. Get ready!',
  };
};

export const isBookingCompleted = (endTime: string): boolean => {
  const timeZone = 'Asia/Dubai';
  const currentTime = toZonedTime(new Date(), timeZone);
  const bookingEndTime = toZonedTime(new Date(endTime), timeZone);
  return currentTime > bookingEndTime;
};
