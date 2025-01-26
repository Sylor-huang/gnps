import nodemailer from 'nodemailer';
import 'dotenv/config';

// 创建 transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // 126 邮箱的 SMTP 服务器
  port: process.env.EMAIL_PORT, // SSL 端口
  secure: true, // 使用 SSL
  auth: {
    user: process.env.FROM_EMAIL, // 你的 126 邮箱地址
    pass: process.env.EMAIL_PASSWD_CODE, // 你的授权码
  },
});

/**
 * 发送邮件
 * @param {string} to - 收件人邮箱
 * @param {string} subject - 邮件主题
 * @param {string} text - 邮件正文（纯文本）
 * @param {string} html - 邮件正文（HTML）
 * @returns {Promise} - 返回发送结果
 */
export function sendMail(to, subject, text, html) {
  const mailOptions = {
    from: process.env.FROM_EMAIL, // 发件人邮箱
    to, // 收件人邮箱
    subject, // 邮件主题
    text, // 纯文本正文
    html, // HTML 正文
  };
  return transporter.sendMail(mailOptions);
}