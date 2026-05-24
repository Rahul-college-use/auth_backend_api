import nodemailer from "nodemailer";
import validator from "validator";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
    user: config.GOOGLE_USER,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Send Email Function
export const sendEmail = async (to, subject, text, html) => {
  try {

    console.log("Preparing to send email to:", to);
    // Check recipient exists
    if (!to) {
      throw new Error("Recipient email is missing");
    }

    // Validate email format
    if (!validator.isEmail(to)) {
      throw new Error("Invalid email address");
    }

    console.log("Recipient:", to);

    const info = await transporter.sendMail({
      from: `"Your Name" <${config.GOOGLE_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent:", info.messageId);

  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};