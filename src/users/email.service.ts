import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    console.log(`Sending welcome email to ${email}...`);
    console.log(
      `Hi ${name}, welcome to our platform! We're glad to have you here.`,
    );
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    console.log(`Sending password reset to ${email} with token ${token}`);
  }
}
