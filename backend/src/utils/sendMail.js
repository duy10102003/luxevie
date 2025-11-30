// backend/src/utils/sendMail.js
import nodemailer from 'nodemailer';

const {
  SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'smtp.gmail.com',
  port: Number(SMTP_PORT) || 465,
  secure: String(SMTP_SECURE ?? 'true') === 'true',
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

export async function sendMail({ to, subject, html }) {
  // Dev fallback: nếu thiếu cấu hình, log ra console để không chết API
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn('[mail] Missing SMTP_USER/PASS — skip real send\n', { to, subject });
    return { messageId: 'dev-skip' };
  }
  return transporter.sendMail({
    from: `"MERN Mart" <${SMTP_USER}>`,
    to, subject, html,
  });
}
