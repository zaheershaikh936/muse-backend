import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { EmailTemplateService } from './email-template/email.template.service';
@Injectable()
export class MailService {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}
  async sendWelcomeEmail(createMailDto: CreateMailDto) {
    await this.emailTemplateService.sendUserWelcome(createMailDto);
  }
}
