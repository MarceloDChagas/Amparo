export interface IEmailService {
  sendEmergencyNotification(
    to: string,
    subject: string,
    body: string,
  ): Promise<void>;
}
