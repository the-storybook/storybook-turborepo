import { Injectable } from '@nestjs/common';

import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
    private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;
    
    constructor() {
        this.transporter = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }


    async sendMail(to: string, subject: string, text: string): Promise<void> {
        const mailOptions = {
            from: '"NestJS Mailer" <riktamsantra56@gmail.com',
            to,
            subject,
            text,
        };

        await this.transporter.sendMail(mailOptions);
    }
}
