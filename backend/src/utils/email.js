const nodemailer = require("nodemailer");
require("dotenv").config();
const email_config = require("../config/emailConfig");

const sendMail = async (options) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport(email_config);

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("There was an error sending the email. Try again later");
  }
};

module.exports = sendMail;
