import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number
}


export class OrderPaymentDetailsDto {
    @IsString()
    @IsNotEmpty()
    orderID: string
}
