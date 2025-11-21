import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { SendUserWelcomeDto } from '../dto/create-mail.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailTemplateService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserWelcome(user: SendUserWelcomeDto) {
    Logger.debug('Email is sending to ' + user.email);
    // 1. Read the template file from the src directory
    // 2. Render the HTML by passing the data to the compiled template
    const html = await this.templateRender('welcome-template.hbs', {
      name: user.name,
      website_url: process.env.REDIRECT_URL_PROD,
    });
    await this.mailerService.sendMail({
      to: user.email,
      subject:
        'Welcome to Muse! Your Journey to Professional Success Starts Now',
      html: html,
    });
    Logger.debug('Email sent successfully to ' + user.email);
  }

  async templateRender(fileName: string, context: any) {
    const template = await this.getConfig(fileName);
    return handlebars.compile(template)(context);
  }

  async getConfig(fileName: string) {
    const templatePath = path.join(
      process.cwd(), // This gives you the project root directory
      'src',
      'utils',
      'email-template',
      'templates',
      fileName,
    );
    return fs.readFileSync(templatePath, 'utf-8');
  }
}
