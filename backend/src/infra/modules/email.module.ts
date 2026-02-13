import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";

import { NodemailerEmailService } from "@/infra/services/nodemailer-email.service";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587", 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
      },
    }),
  ],
  providers: [
    {
      provide: "IEmailService",
      useClass: NodemailerEmailService,
    },
  ],
  exports: ["IEmailService"],
})
export class EmailModule {}
