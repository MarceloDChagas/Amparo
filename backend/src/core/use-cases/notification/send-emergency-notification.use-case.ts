import { Inject, Injectable, Logger } from "@nestjs/common";

import { Occurrence } from "@/core/domain/entities/occurrence.entity";
import type { IEmergencyContactRepository } from "@/core/domain/repositories/emergency-contact-repository.interface";
import type { IEmailService } from "@/core/domain/services/email-service.interface";

export interface NotificationResult {
  totalContacts: number;
  emailsSent: number;
  emailsFailed: number;
}

/**
 * RF12 — Comunicação Multicanal (HIGH)
 * Despacha notificações de emergência por e-mail para todos os Contatos
 * de Confiança da usuária. O e-mail inclui link do Google Maps com a localização.
 *
 * RN05 — Duplo Envio de Alertas
 * Além do alerta no Dashboard, o sistema obrigatoriamente notifica os contatos
 * cadastrados da vítima quando uma ocorrência é criada (RF05).
 *
 * RF08 — Sistema de Notificações (LOW)
 * As notificações aumentam a percepção de segurança e mantêm a rede de apoio
 * da usuária informada em tempo real.
 *
 * NRF08 — Segurança contra Ameaças Multivariadas
 * Dados inseridos pela usuária (nome, endereço) são escapados com `escapeHtml`
 * antes de compor o corpo do e-mail, prevenindo XSS no cliente de e-mail.
 */
@Injectable()
export class SendEmergencyNotificationUseCase {
  private readonly logger = new Logger(SendEmergencyNotificationUseCase.name);

  constructor(
    @Inject("IEmergencyContactRepository")
    private readonly emergencyContactRepository: IEmergencyContactRepository,
    @Inject("IEmailService")
    private readonly emailService: IEmailService,
  ) {}

  async execute(
    userId: string,
    occurrence: Occurrence,
  ): Promise<NotificationResult> {
    this.logger.log(
      `Sending emergency notifications for user ${userId}, occurrence ${occurrence.id}`,
    );

    // RN05 — busca todos os contatos de confiança para notificação obrigatória.
    const contacts = await this.emergencyContactRepository.findByUserId(userId);

    if (contacts.length === 0) {
      this.logger.warn(`No emergency contacts found for user ${userId}`);
      return {
        totalContacts: 0,
        emailsSent: 0,
        emailsFailed: 0,
      };
    }

    // Filter contacts with email addresses
    const contactsWithEmail = contacts.filter((contact) => contact.email);

    if (contactsWithEmail.length === 0) {
      this.logger.warn(
        `No emergency contacts with email addresses found for user ${userId}`,
      );
      return {
        totalContacts: contacts.length,
        emailsSent: 0,
        emailsFailed: 0,
      };
    }

    this.logger.log(
      `Found ${contactsWithEmail.length} emergency contacts with email addresses`,
    );

    // Send notifications to all contacts
    let emailsSent = 0;
    let emailsFailed = 0;

    for (const contact of contactsWithEmail) {
      try {
        const subject = "🚨 Emergency Alert - Amparo";
        const body = this.buildEmailBody(contact.name, occurrence);

        await this.emailService.sendEmergencyNotification(
          contact.email!,
          subject,
          body,
        );

        emailsSent++;
        this.logger.log(
          `Notification sent successfully to ${contact.name} (${contact.email})`,
        );
      } catch (error) {
        emailsFailed++;
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        this.logger.error(
          `Failed to send notification to ${contact.name} (${contact.email}): ${errorMessage}`,
          errorStack,
        );
        // Continue to next contact even if one fails
      }
    }

    this.logger.log(
      `Notification summary: ${emailsSent} sent, ${emailsFailed} failed out of ${contactsWithEmail.length} total`,
    );

    return {
      totalContacts: contacts.length,
      emailsSent,
      emailsFailed,
    };
  }

  /**
   * Escapes HTML special characters to prevent XSS attacks
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    return text.replace(
      /[&<>"'/]/g,

      (char) =>
        Object.prototype.hasOwnProperty.call(map, char) ? map[char] : char,
    );
  }

  private buildEmailBody(contactName: string, occurrence: Occurrence): string {
    // Escape all user-supplied data to prevent XSS
    const safeContactName = this.escapeHtml(contactName);
    const safeDescription = this.escapeHtml(occurrence.description);
    const safeLatitude = this.escapeHtml(occurrence.latitude.toString());
    const safeLongitude = this.escapeHtml(occurrence.longitude.toString());

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background-color: #dc3545;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 20px;
              border-radius: 0 0 8px 8px;
            }
            .alert-box {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
            }
            .info-row {
              margin: 10px 0;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 12px;
              color: #777;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Emergency Alert</h1>
            </div>
            <div class="content">
              <p>Hello <strong>${safeContactName}</strong>,</p>
              
              <div class="alert-box">
                <strong>⚠️ This is an emergency notification from Amparo.</strong>
                <br>
                Someone you are registered as an emergency contact for has reported an occurrence.
              </div>
              
              <h3>Occurrence Details:</h3>
              
              <div class="info-row">
                <span class="label">Description:</span>
                <p>${safeDescription}</p>
              </div>
              
              <div class="info-row">
                <span class="label">Location:</span>
                <p>
                  Latitude: ${safeLatitude}<br>
                  Longitude: ${safeLongitude}
                </p>
                <p>
                  <a href="https://www.google.com/maps?q=${safeLatitude},${safeLongitude}" target="_blank" rel="noopener noreferrer">
                    📍 View on Google Maps
                  </a>
                </p>
              </div>
              
              <div class="alert-box">
                <strong>⚡ Please take immediate action if necessary.</strong>
                <br>
                Contact local authorities or reach out to the person who registered you if you can provide assistance.
              </div>
              
              <div class="footer">
                <p>This is an automated message from Amparo Emergency Response System.</p>
                <p>If you believe you received this message in error, please contact support.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
