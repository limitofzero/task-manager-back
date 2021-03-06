import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { Observable, from } from 'rxjs';

@Injectable()
export class MailTransporterService {
  private transporter: Transporter = null;

  constructor() {
    const ENV = process.env;
    const port = Number.parseInt(ENV.EMAIL_PORT);

    this.transporter = createTransport({
      port,
      host: ENV.EMAIL_HOST,
      secure: true,
      auth: {
        user: ENV.EMAIL_LOGIN,
        pass: ENV.EMAIL_PASSWORD,
      },
    });
  }

  public sendEmail(options: Options): Observable<void> {
    const promise = this.transporter.sendMail(options);
    return from(promise);
  }
}
