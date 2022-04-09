const nodemailer = require('nodemailer');
const ApiError = require('../exeptions/apiError');

const styles = {
  main: `
	style="
		background: #e7f0f8; 
		padding: 40px;
		font-family: sans-serif; 
		color: #22304a;
		"
		`,
  a: `
	style="
		display: block;
		width: 300px;
		height: 40px;
		background: #232443;
		line-height: 40px;
		text-align: center;
		border-radius: 20px;
		text-decoration: none;
		font-size: 16px;
		color: white;
		margin-top: 40px;
		"
	`,
  bold: `
	style="
		font-weight: bold;
		"
		`,
};

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendSuccessfulRegistrationMail(to) {
    await this.transporter.sendMail(
      {
        from: process.env.SMTP_USER,
        to,
        subject: 'Успешная регистрация!',
        text: '',
        html: `
			<div ${styles.main}>
				<h1>Поздравляем! Вы успешно зарегистрировались в приложении fitness app.</h1>
				<p>Надеемся, Вам понравится наше приложение</p>
			</div>
			`,
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  async sendResetPasswordMail(to, link) {
    await this.transporter.sendMail(
      {
        from: process.env.SMTP_USER,
        to,
        subject: 'Восстановление пароля на ' + process.env.API_URL,
        text: '',
        html: `
			<div ${styles.main}>
				<h1>От вас поступила заявка на восстановление пароля.</h1>
				<p>Если вы не запрашивали восстановление пароля, проигнорируйте это письмо. Если запрос делали вы, то для сброса пароля перейдите по ссылке</p>
				<a ${styles.a} href="${link}">Восстановить доступ</a>
			</div>
			`,
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  // async sendFooterQuestionMail(email, message, files) {
  // 	await this.transporter.sendMail({
  // 		from: process.env.SMTP_USER,
  // 		to: 'orlov.marsel@yandex.ru',
  // 		subject: 'Вопрос от пользователя с сайта ' + process.env.CLIENT_URL,
  // 		text: '',
  // 		html:
  // 			`
  // 		<div ${styles.main}>
  // 			<h1>Пользователь сервиса задал вопрос</h1>
  // 			<span ${styles.bold}>Email пользователя: </span><p style="color: #22304a">${email}</p>
  // 			<span ${styles.bold}>Вопрос пользователя: </span><p>${message}</p>
  // 		</div>
  // 		`,
  // 		attachments: files
  // 	}, (error) => {
  // 		console.log('Ошибка при отправки письма', error)
  // 	})
  // }
}

module.exports = new MailService();
