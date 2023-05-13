const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail(subject: string, text: string, to: string) {
	const transporter = nodemailer.createTransport({
		host: "smtp.zoho.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.ZOHO_EMAIL,
			pass: process.env.ZOHO_PASSWORD,
		},
	});

	try {
		const info = await transporter.sendMail({
			from: `Klanera <${process.env.ZOHO_EMAIL}>`,
			to: to,
			subject: subject,
			text: text,
		});

		return info;
	} catch (err) {
		console.error(err);
		throw new Error("Failed to send email");
	}
}

module.exports = sendEmail;
