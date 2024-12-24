import { differenceInMinutes, isToday, isPast, isFuture } from 'date-fns';

interface BookingStatus {
    booking: boolean;  // true if booking is upcoming, false if expired
    status: 'expired' | 'very soon' | 'soon' | 'not today';
    title: string;
    description: string;
}


export const getBookingStatus = (bookingDate: string, startTime: string): BookingStatus => {
    const now = new Date();
    const start = new Date(startTime);
    const bookingDay = new Date(bookingDate);

    if (isToday(bookingDay)) {
        console.log(start, "start time");
        console.log(now, "now time");
        const minutesToStart = differenceInMinutes(start, now);
        console.log(minutesToStart, "minutesToStart");
        if (minutesToStart <= 0) {
            return {
                booking: false,
                status: 'expired',
                title: 'Your Session is Expired Today',
                description: 'This session has expired today. Please book another session.',
            };
        }

        if (minutesToStart <= 60) {
            return {
                booking: true,
                status: 'very soon',
                title: 'Your Session is Starting Soon',
                description: 'Your session will start in less than 30 minutes. Get ready!',
            };
        }

        return {
            booking: false,
            status: 'soon',
            title: 'Your Session is Scheduled',
            description: 'Your session is coming up, but it will start soon.',
        };
    }

    if (isPast(bookingDay)) {
        return {
            booking: false,
            status: 'expired',
            title: 'Your Session is Expired',
            description: 'This session has expired. Please book another session.',
        };
    }

    if (isFuture(bookingDay)) {
        return {
            booking: false,
            status: 'not today',
            title: 'Your Session is Not Today',
            description: 'This session is scheduled for another day. Please check the date.',
        };
    }
    return {
        booking: false,
        status: 'not today',
        title: 'Your Session is Not Today',
        description: 'This session is scheduled for another day. Please check the date.',
    };
};

export const isBookingCompleted = (endTime: string): boolean => {
    const currentTime = new Date();
    const bookingEndTime = new Date(endTime);
    if (currentTime > bookingEndTime) {
        return true
    } else {
        return false
    }
}
