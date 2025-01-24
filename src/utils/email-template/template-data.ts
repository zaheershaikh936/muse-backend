export const acceptBookingBodyFn = (isPaymentCompleted: any) => {
  const bookingDate = new Date(isPaymentCompleted?.booking.bookingDate);
  const day = bookingDate.getDate();
  const year = bookingDate.getFullYear();
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    bookingDate,
  );
  const message = {
    user: {
      name: isPaymentCompleted?.user.name,
    },
    mentor: {
      name: isPaymentCompleted?.mentor.name,
      email: isPaymentCompleted?.mentor.email,
    },
    booking: {
      day: isPaymentCompleted?.booking.day,
      month: month,
      date: `${day}, ${year}`,
      startTimeString: isPaymentCompleted?.booking?.startTimeString,
      endTimeString: isPaymentCompleted?.booking?.endTimeString,
    },
    web_url: `${process.env.WEB_URL}/booking/lobby/${isPaymentCompleted.uniqueUrl}`,
  };
  return message;
};

export const conformBookingBodyFn = (isPaymentCompleted: any) => {
  const bookingDate = new Date(isPaymentCompleted?.booking.bookingDate);
  const day = bookingDate.getDate();
  const year = bookingDate.getFullYear();
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    bookingDate,
  );
  const message = {
    mentorName: isPaymentCompleted.mentor.name,
    booking: {
      day: isPaymentCompleted?.booking.day,
      month: month,
      date: `${day}, ${year}`,
      startTimeString: isPaymentCompleted?.booking?.startTimeString,
      endTimeString: isPaymentCompleted?.booking?.endTimeString,
    },
    mentor: {
      name: isPaymentCompleted.mentor.name,
      email: isPaymentCompleted.mentor.email,
    },
    user: {
      name: isPaymentCompleted?.user.name,
      email: isPaymentCompleted?.user?.email,
    },
    web_url: process.env.WEB_URL,
  };
  return message;
};

export const cancelBookingByMentorBodyFn = (data: any) => {
  const bookingDate = new Date(data?.booking?.bookingDate);
  const day = bookingDate.getDate();
  const year = bookingDate.getFullYear();
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
    bookingDate,
  );
  const mentor = {
    mentorName: data.mentor.name,
    user: {
      name: data?.user?.name,
      email: data?.user?.email,
    },
    booking: {
      day: data?.booking?.day,
      month: month,
      bookingDate: `${day}, ${year}`,
      startTimeString: data?.booking?.startTimeString,
      endTimeString: data?.booking?.endTimeString,
    },
    web_url: process.env.WEB_URL,
  };
  return mentor;
};
