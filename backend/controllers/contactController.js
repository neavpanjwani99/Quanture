const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to DB
    const contact = await Contact.create({ name, email, message });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail", // ya smtp config
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // tumhari mail pe aayega
      subject: `New Contact Message from ${name}`,
      text: `
You have a new contact form submission:

Name: ${name}
Email: ${email}
Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Message sent successfully!", contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendContactMessage };
