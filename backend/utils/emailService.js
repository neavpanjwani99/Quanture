// utils/sendEmail.js
const nodemailer = require("nodemailer");

/**
 * Send email with optional CSV attachment
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} csv - Optional CSV content to attach
 */
const sendEmail = async (to, subject, html, csv) => {
  try {
    // Create transporter for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS, // from .env
      },
    });

    // Prepare mail options
    const mailOptions = {
      from: `"Quanture App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments: csv
        ? [
            {
              filename: "transactions.csv",
              content: csv,
              contentType: "text/csv",
            },
          ]
        : [],
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);

    // Modern console log
    console.log(
      `%cEmail sent successfully!`,
      "color: #0f0; font-weight: bold; font-size: 14px;"
    );
    console.log(`Recipient: ${to}`);
    console.log(`Message ID: ${info.messageId}`);
    if (csv) console.log(`CSV attached: transactions.csv`);

  } catch (error) {
    // Stylish error logging
    console.error(
      `%cEmail send failed: ${error.message}`,
      "color: #f00; font-weight: bold; font-size: 14px;"
    );
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
