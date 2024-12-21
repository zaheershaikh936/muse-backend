import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class InvoiceService {
  async generateInvoice(jsonData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Content
      this.addHeader(doc, jsonData);
      this.addInvoiceDetails(doc, jsonData);
      this.addClientDetails(doc, jsonData);
      this.addInvoiceTable(doc, jsonData);
      this.addNotesAndFooter(doc, jsonData);

      // Finalize PDF
      doc.end();
    });
  }

  private addHeader(doc: PDFKit.PDFDocument, data: any) {
    // Logo
    if (data.logo) {
      try {
        doc.image(data.logo, 50, 30, { width: 100 });
      } catch (e) {
        console.log('Logo not found.');
      }
    }

    // Company Name
    doc.fontSize(24)
      .fillColor('#FF4500') // Custom brand color
      .text('ZONESSO', 50, 50, { align: 'left' })
      .fontSize(14)
      .fillColor('#000000')
      .text('218 The Iridium Building, Al Barsha, Dubai, UAE', { align: 'left' })
      .text('Tel: 054 402 1112 | support@zonesso.com', { align: 'left' });
  }

  private addInvoiceDetails(doc: PDFKit.PDFDocument, data: any) {
    // Invoice Details
    const topMargin = 50;
    doc.fontSize(12)
      .fillColor('#000000')
      .text(`Invoice No: ${data.invoice.number}`, 400, topMargin, { align: 'right' })
      .text(`Invoice Date: ${data.invoice.date}`, { align: 'right' })
      .text(`Status: `, { continued: true })
      .fillColor(data.invoice.statusColor)
      .text(data.invoice.status, { align: 'right' });
  }

  private addClientDetails(doc: PDFKit.PDFDocument, data: any) {
    // Client Details Section
    doc.moveDown(2)
      .fontSize(12)
      .fillColor('#333333')
      .text('Invoice to', 50, 150)
      .moveDown(0.5)
      .fontSize(14)
      .fillColor('#000000')
      .text(data.client.name)
      .fontSize(12)
      .text(data.client.email)
      .text(data.client.address);
  }

  private addInvoiceTable(doc: PDFKit.PDFDocument, data: any) {
    const tableTop = 300;

    // Table Header
    doc.fontSize(12)
      .fillColor('#FFFFFF')
      .rect(50, tableTop, 500, 25)
      .fill('#FF4500') // Header background
      .stroke()
      .fillColor('#FFFFFF')
      .text('Description', 55, tableTop + 7)
      .text('Price', 255, tableTop + 7)
      .text('Qty', 355, tableTop + 7)
      .text('Total Price', 455, tableTop + 7);

    // Table Rows
    let y = tableTop + 30;
    doc.fillColor('#000000');
    data.items.forEach((item: any) => {
      doc.text(item.description, 55, y)
        .text(item.price, 255, y)
        .text(item.quantity.toString(), 355, y)
        .text(item.totalPrice, 455, y);
      y += 25;
    });

    // Subtotal and Total
    doc.fontSize(12)
      .fillColor('#000000')
      .text(`Sub total: ${data.subTotal}`, 400, y + 10, { align: 'right' })
      .fontSize(14)
      .fillColor('#FF4500')
      .text(`Total: ${data.total}`, { align: 'right' });
  }

  private addNotesAndFooter(doc: PDFKit.PDFDocument, data: any) {
    const footerTop = 450;

    // Notes Section
    doc.moveTo(50, footerTop)
      .fontSize(12)
      .fillColor('#000000')
      .text('Notes:', 50)
      .fontSize(10)
      .fillColor('#555555')
      .text(data.notes, 50, footerTop + 15);

    // Payment Method Section
    doc.fontSize(12)
      .fillColor('#000000')
      .text('Payment method:', 50, footerTop + 80)
      .fontSize(10)
      .fillColor('#555555')
      .text(`Bank Name: ${data.paymentMethod.bankName}`)
      .text(`Account Name: ${data.paymentMethod.accountName}`)
      .text(`Bank Details: ${data.paymentMethod.bankDetails}`);

    // Terms Section
    doc.fontSize(12)
      .fillColor('#000000')
      .text('Terms and Conditions:', 300, footerTop + 80)
      .fontSize(10)
      .fillColor('#555555')
      .text(data.terms, 300, footerTop + 95);

    // Footer
    doc.moveDown(5)
      .fontSize(10)
      .fillColor('#000000')
      .text('218 The Iridium Building, Al Barsha, Dubai, UAE | Tel: 054 402 1112 | support@zonesso.com', {
        align: 'center',
      });
  }
}
