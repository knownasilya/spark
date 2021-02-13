import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';

@Injectable()
export class SmsService {
  fromPhoneNumber: string;

  constructor(
    @InjectTwilio() private readonly client: TwilioClient,
    private readonly config: ConfigService
  ) {
    this.fromPhoneNumber = config.get('twilio.phoneNumber');
  }

  async sendSMS(toPhoneNumber: string, message: string) {
    try {
      return await this.client.messages.create({
        body: message,
        from: this.fromPhoneNumber,
        to: toPhoneNumber,
      });
    } catch (e) {
      console.log('sendSMS error: ', e);
      return e;
    }
  }
}
