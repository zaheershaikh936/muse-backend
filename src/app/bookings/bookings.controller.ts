import { Controller, Post, Body, UseGuards, Param, Get, Patch } from '@nestjs/common';
import { BookingsService } from './booking/bookings.service';
import { CancelBookingDto, CreateBookingDto } from './dto/booking.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/utils/decorator/user.decorator';
import { UsersService } from '../users/user/users.service';
import { MentorService } from '../mentor/mentor/mentor.service';
import { decryptBookingData, encryptBookingData } from 'src/utils/helper/booking-encrypt-decrypt'
import { PaymentService } from '../payment/payment-order/payment.service';
import { PaymentCreateOrderResT } from 'src/utils/types';
import { generateRoomId } from 'src/utils/helper/generate-booking-room-id';
import { isBookingCompleted } from 'src/utils/helper/booking-status-on-time';


@UseGuards(AuthGuard('jwt'))
@Controller('booking')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly userService: UsersService,
    private readonly mentorService: MentorService,
    private readonly paymentService: PaymentService
  ) { }

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @User('_id') id: string) {
    createBookingDto.userId = id;
    const user = await this.userService.findOneForBooking(id)
    const mentor = await this.mentorService.findOneForBooking(createBookingDto.mentorId)
    createBookingDto.user = {
      name: user.name,
      email: user.email,
      image: user.image
    }
    createBookingDto.mentor = {
      name: mentor.user.name,
      email: mentor.user.email,
      image: mentor.user.image
    }
    createBookingDto.amount = "20";
    const booking = await this.bookingsService.createBooking(createBookingDto);
    const paymentUrl = await encryptBookingData(booking?._id.toString(), booking?.booking?.startTime.toString(), booking?.booking?.endTime.toString());
    const redirectBaseUrl = process.env.PAYPAL_ENV !== 'live' ? process.env.REDIRECT_URL_LOCAL : process.env.REDIRECT_URL_PROD;
    const body = {
      price: "20",
      successUrl: `${redirectBaseUrl}/booking/success/${paymentUrl}`,
      cancelUrl: `${redirectBaseUrl}/booking/cancel/${paymentUrl}`
    }
    const paymentResponse = await this.paymentService.createPayment(body)
    const payment: PaymentCreateOrderResT = paymentResponse.data;
    const paymentBody = {
      payment_url: paymentUrl,
      orderId: payment.id,
      purchase_units: {
        amount: {
          currency_code: payment.purchase_units[0].amount.currency_code,
          value: payment.purchase_units[0].amount.value
        }
      },
      create_time: payment.create_time,
      links: payment.links
    }
    await this.bookingsService.updateBookingPaymentDetails(booking._id.toString(), paymentBody)
    return payment.links[1].href;
  }

  @Get('/conform/:id')
  async ConformBooking(@Param('id') uniqueUrl: string) {
    const isPaymentCompleted = await this.bookingsService.findOneByPaymentUrl(uniqueUrl)
    if (isPaymentCompleted.status !== 'pending') return isPaymentCompleted
    const body = { updatedAt: new Date(), status: 'paid', isPaid: true }
    const data = await this.bookingsService.updateBookingStatus(uniqueUrl, body);
    if (data) {
      const accessToken = await this.paymentService.paypalAuth();
      const conformPayment = await this.paymentService.conformOrder(accessToken, data?.paymentId);
      delete data?.paymentId;
      const refundId = conformPayment.purchase_units[0].payments.captures[0].id
      return await this.bookingsService.updateBookingStatus(uniqueUrl, { 'payment.refundId': refundId });
    }
    return "conformPayment";
  }

  @Get('/accept/:id')
  async AcceptBooking(@Param('id') uniqueUrl: string) {
    const isPaymentCompleted = await this.bookingsService.findOneByPaymentUrl(uniqueUrl)
    if (isPaymentCompleted.status !== 'paid') return isPaymentCompleted
    const roomId = generateRoomId();
    const body = { updatedAt: new Date(), status: 'accepted', isPaid: true, roomId }
    return await this.bookingsService.updateBookingStatus(uniqueUrl, body);
  }

  @Get('/:url')
  async findBooking(@Param('url') url: string) {
    const data = decryptBookingData(url);
    const id = data[0];
    return this.bookingsService.findOneById(id)
  }

  @Patch('/cancel/:id')
  async CancelBooking(@Param('id') uniqueUrl: string, @Body() cancelBookingDto: CancelBookingDto, @User('_id') id: string) {
    const isPaymentPaid = await this.bookingsService.findOneByPaymentUrl(uniqueUrl)
    if (isPaymentPaid.status !== 'paid') return "You can't cancel this booking.";
    const body = { updatedAt: new Date(), status: 'cancelled', cancelReason: { ...cancelBookingDto, reason: cancelBookingDto.cancelReason, userId: id, isMentor: cancelBookingDto.isMentor } };
    const data = await this.bookingsService.updateBookingStatus(uniqueUrl, body);
    const refund = await this.paymentService.refundOrderPaymentPaypal(data.refundId);
    await this.bookingsService.updateBookingStatus(uniqueUrl, { refundDetails: refund });
    return data; 
  }


  @Patch('join/:url')
  async updateUserStatus(@Param('url') url: string) {
    const body = { 'user.isUserJoin': true, 'mentor.isUserJoin': true }
    return await this.bookingsService.updateBookingStatus(url, body);
  }

  @Patch('/complete/:url')
  async CompleteBooking(@Param('url') url: string) {
    const uniqueUrl = decryptBookingData(url);
    const { booking } = await this.bookingsService.findBookingById(uniqueUrl[0]);
    const { endTime } = booking
    const body = { status: "completed" }
    await this.bookingsService.updateBookingStatus(url, body);
    const isBookingCompletedStatus = isBookingCompleted(endTime.toString())
    if (isBookingCompletedStatus) {
      const body = { status: "completed" }
      await this.bookingsService.updateBookingStatus(url, body);
      return isBookingCompletedStatus
    }
    return isBookingCompletedStatus
  }
}