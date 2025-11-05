const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  connectionTimeout: 15000,
  socketTimeout: 15000
});

const generateVerificationToken = (userId, email) => {
  return jwt.sign(
    { userId, email, type: 'email-verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const generateResetToken = (userId, email) => {
  return jwt.sign(
    { userId, email, type: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const sendVerificationEmail = async (user) => {
  const verificationToken = generateVerificationToken(user.id, user.email);
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Verifikasi Email - Chill Movie App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Chill Movie App</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px;">
          <h2>Halo ${user.fullname || user.name}!</h2>
          <p>Terima kasih sudah daftar. Klik tombol di bawah untuk verifikasi email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verifikasi Email
            </a>
          </div>
          <p>Atau copy link ini ke browser:</p>
          <p style="background: #f0f0f0; padding: 10px; word-break: break-all;">${verificationUrl}</p>
          <p>Link berlaku 24 jam.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Kalau bukan anda yang daftar, abaikan aja email ini.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', user.email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

const sendPasswordResetEmail = async (user) => {
  const resetToken = generateResetToken(user.id, user.email);
  const resetUrl = `${process.env.BASE_URL}/api/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Reset Password - Chill Movie App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Chill Movie App</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px;">
          <h2>Reset Password</h2>
          <p>Halo ${user.fullname || user.name},</p>
          <p>Reset password untuk akun anda. Klik tombol di bawah kalau itu anda:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Atau copy link ini:</p>
          <p style="background: #f0f0f0; padding: 10px; word-break: break-all;">${resetUrl}</p>
          <p>Link berlaku 1 jam.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Kalau bukan anda yang minta, abaikan aja.
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', user.email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: user.email,
    subject: 'Selamat Datang di Chill Movie App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Chill Movie App</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px;">
          <h2>Selamat Datang, ${user.fullname || user.name}!</h2>
          <p>Akun anda udah jadi. Sekarang bisa:</p>
          <ul style="line-height: 2;">
            <li>Jelajahi film dan series</li>
            <li>Buat daftar film favorit anda</li>
            <li>Dapetin rekomendasi film personal</li>
            <li>Download untuk nonton offline</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.BASE_URL}/api/auth/login" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Mulai Nonton
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            Butuh bantuan? Email support@chillmovie.com
          </p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};