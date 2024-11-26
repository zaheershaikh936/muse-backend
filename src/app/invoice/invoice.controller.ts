import { Controller, Post } from '@nestjs/common';
import { InvoiceService } from './invoice/invoice.service';
import { FileUploadService } from '../file-upload/file-upload.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService, private readonly fileService: FileUploadService) { }

  @Post()
  async create() {
    const jsonData = {
      "logo": "	https://www.zonesso.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.014c7734.webp&w=640&q=10",
      "invoice": {
        "number": "10001",
        "date": "1/11/2024",
        "status": "Paid",
        "statusColor": "green"
      },
      "client": {
        "name": "Arthur Edward Lim Pascua",
        "email": "arthur.pascua@zonesso.com",
        "address": "Gray Building, Al Barsha\nDubai, UAE"
      },
      "items": [
        {
          "description": "Premium Ad Post",
          "price": "AED 99.00",
          "quantity": 2,
          "totalPrice": "AED 198.00"
        }
      ],
      "notes": "Here we can write additional notes for the client to get a better understanding of this invoice.",
      "subTotal": "AED 198.00",
      "total": "AED 207.9",
      "paymentMethod": {
        "bankName": "Wio Business",
        "accountName": "ZONESSO PORTAL L.L.C",
        "bankDetails": "123456789"
      },
      "terms": "Please send payment within 30 days of receiving this invoice.",
      "footer": {
        "address": "218 The Iridium Building, Al Barsha, Dubai, UAE",
        "contact": "Tel: 054 402 1112",
        "email": "support@zonesso.com"
      }
    }
    const file = await this.invoiceService.generateInvoice(jsonData);
    return this.fileService.generateInvoice(file)
  }
}
