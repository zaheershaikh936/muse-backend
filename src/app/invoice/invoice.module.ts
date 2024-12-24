import { Module, forwardRef } from '@nestjs/common';
import { InvoiceService } from './invoice/invoice.service';
import { InvoiceController } from './invoice.controller';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    forwardRef(() => FileUploadModule),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
