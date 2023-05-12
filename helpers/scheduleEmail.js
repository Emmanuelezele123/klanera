let nodemailer = require("nodemailer");

async function scheduleEmail(subject, text, to) {
	let transporter = nodemailer.createTransport({
		host: "smtp.zoho.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.ZOHO_EMAIL,
			pass: process.env.ZOHO_PASSWORD,
		},
	});

	// send mail with defined transport object
	return sendMail(transporter, subject, text, to).then((res) => {
		return res;
	});
}

function sendMail(transporter, subject, text, to) {
	return new Promise((resolve) => {
		let info = transporter.sendMail({
			from: `DONOTREPLY <${process.env.ZOHO_EMAIL}>`,
			to: to,
			subject: subject,
			text: text,
		});
		resolve(info);
	});
}

module.exports = scheduleEmail;
