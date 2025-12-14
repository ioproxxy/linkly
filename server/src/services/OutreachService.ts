import nodemailer from 'nodemailer';
import prisma from '../utils/prisma';

export class OutreachService {
    private transporter;

    constructor() {
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD
                }
            });
        } else {
            console.log("No Email Configured. Emails will be logged only.");
        }
    }

    async sendEmail(lead: any, subject: string, body: string) {
        if (!this.transporter) {
            console.log(`[MOCK EMAIL] To: ${lead.email} | Subject: ${subject} | Body: ${body}`);
            return true;
        }

        try {
            await this.transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: lead.email,
                subject: subject,
                text: body
            });
            console.log(`Email sent to ${lead.email}`);
            return true;
        } catch (error) {
            console.error("Failed to send email", error);
            return false;
        }
    }
}
