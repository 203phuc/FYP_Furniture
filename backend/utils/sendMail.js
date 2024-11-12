import nodemailer from "nodemailer";

// Send email verification
const sendMail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  // Verification URL with the token
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: email,
    subject: "Please verify your email address",
    text: `Click the following link to verify your email: ${verificationUrl}`,
  };

  await transporter.sendMail(mailOptions);
};

export { sendMail };
