import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { OtpMailDto } from './dto/otp-mail.dto';
import { OnEvent } from '@nestjs/event-emitter';
import mailConfig from './config/mail.config';

@Injectable()
export class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly logger = new Logger(MailService.name);
  constructor(
    @Inject(mailConfig.KEY)
    mailConfiguration: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = createTransport(mailConfiguration);
  }

  @OnEvent('send_activation_email')
  sendActivationMail(dto: OtpMailDto) {
    this.logger.debug(`Sending verification email to ${dto.to}`);
    this.transporter.sendMail({
      to: dto.to,
      subject: 'Подтвердите вашу почту',
      html: `
      <!doctype html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .header img {
              width: 300px;
              border-radius: 15px;
            }
            .content {
              text-align: center;
            }
            .otp-code {
              display: inline-block;
              font-size: 24px;
              font-weight: bold;
              background-color: #f0f0f0;
              padding: 10px 20px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #888888;
              margin-top: 20px;
            }
            .footer a {
              color: #888888;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1>Подтвердите ваш аккаунт</h1>
              <p>
                Спасибо за регистрацию в IRecommend! Чтобы завершить процесс
                регистрации, пожалуйста, используйте следующий код для подтверждения:
              </p>
              <div class="otp-code">${dto.code}</div>
              <p>
                Если вы не регистрировались на нашем сайте, просто проигнорируйте это
                письмо.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 IRecommend. Все права защищены.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    });
  }
  @OnEvent('send_password_reset_email')
  sendPasswordResetMail(dto: OtpMailDto) {
    this.logger.debug(`Sending reset password email to ${dto.to}`);
    this.transporter.sendMail({
      to: dto.to,
      subject: 'Сброс пароля',
      html: `
      <!doctype html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .header img {
              width: 300px;
              border-radius: 15px;
            }
            .content {
              text-align: center;
            }
            .otp-code {
              display: inline-block;
              font-size: 24px;
              font-weight: bold;
              background-color: #f0f0f0;
              padding: 10px 20px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #888888;
              margin-top: 20px;
            }
            .footer a {
              color: #888888;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1>Сброс пароля</h1>
              <p>
                Вы отправили запрос на сброс пароля в IRecommend! Чтобы поменять
                пароль, используйте следующий код для подтверждения:
              </p>
              <div class="otp-code">${dto.code}</div>
              <p>
                Код действителен в течении 5 минут.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 IRecommend. Все права защищены.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    });
  }
}
