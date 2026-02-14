import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";

import { NodemailerEmailService } from "@/infra/services/nodemailer-email.service";

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("SMTP_HOST") || "smtp.gmail.com",
          port: configService.get<number>("SMTP_PORT") || 587,
          secure: false,
          auth: {
            user: configService.get<string>("SMTP_USER"),
            pass: configService.get<string>("SMTP_PASSWORD"),
          },
        },
        defaults: {
          from:
            configService.get<string>("SMTP_FROM") ||
            configService.get<string>("SMTP_USER"),
        },
      }),
      inject: [ConfigService],
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
