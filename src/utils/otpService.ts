import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

interface Options {
  email: string;
  subject: string;
  html: string;
}

const sendOtpToEMail = async (options: Options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"CircleSpace" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.verify();
    console.log("SMTP connection successful");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (err: any) {
    console.error("Error while sending email:", err);
    throw new Error("Failed to send email: " + err.message);
  }
};

export default sendOtpToEMail;
