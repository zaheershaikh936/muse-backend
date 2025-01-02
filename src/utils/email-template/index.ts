import { Logger } from '@nestjs/common';
import * as  sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.SEND_GRID_API_KEY;
const senderEmail = process.env.SEND_GRID_EMAIL;

export const sendMail = async (
    to: string,
    subject: string,
    templateId: string,
    data: Record<string, unknown>,
) => {
    try {
        sgMail.setApiKey(apiKey);
        const message: sgMail.MailDataRequired = {
            to,
            from: { email: senderEmail, name: "Muse mentoring platform" },
            subject: subject,
            templateId,
            dynamicTemplateData: data,
        };
        Logger.debug("Email is sending to " + to);
        await sgMail.send(message);
        Logger.debug("Email sent successfully to " + to);
    } catch (error) {
        Logger.error(error);
        return error;
    }
};

export const welcomeEmail = async (to: string, data: Record<string, unknown>) => {
    try {
        const subject = "Welcome to the Muse Mentoring Platform";
        const templateId = process.env.WElCOME_EMAIL_TEMPLATE_ID || "";
        return await sendMail(to, subject, templateId, data);
    } catch (error) {
        return error;
    }
}

export const newBooking = async (to: string, data: Record<string, unknown>) => {
    try {
        const subject = `New booking from ${(data.user as { name?: string })?.name}`;
        const templateId = process.env.NEW_BOOKING_TEMPLATE_ID || "";
        return await sendMail(to, subject, templateId, data);
    } catch (error) {
        return error;
    }
}


export const userCancelBooking = async (to: string, data: Record<string, unknown>) => {
    try {
        const subject = `Your Booking has been cancelled`;
        const templateId = process.env.CANCEL_BOOKING_TEMPLATE_ID || "";
        return await sendMail(to, subject, templateId, data);
    } catch (error) {
        return error;
    }
}