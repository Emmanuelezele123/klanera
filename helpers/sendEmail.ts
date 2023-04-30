// using Twilio SendGrid's v3 Node.js Library
const sgMail = require('@sendgrid/mail');
require("dotenv").config();

const sendEmail = (email: string, subject: string, text: string, res: any, type: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const message = {
    to: email, // Change to your recipient
    from: 'emmanuel.ezele@stu.cu.edu.ng', // Change to your verified sender
    subject: subject,
    text: text,
  };

  sgMail
    .send(message)
    .then(() => {
      if (type === "email") {
        console.log('Email sent');
        return res.status(200).json({ status: "Success", message: "password reset link sent to your email account" });

      } else {
        return res.status(200).json({ status: "Success", message: "send verification email" });
      }

    })
    .catch((error: any) => {
      if (type === "email") {
        console.error(error);
        return res.status(401).json({ status: "Failure", message: "password reset link was not sent" });

      } else {
        console.error(error);
        return res.status(401).json({ status: "Failure", message: "email veriication not sent" });
      }
    });
};

module.exports = sendEmail;
