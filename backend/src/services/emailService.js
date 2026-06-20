/**
 * Email Service
 * Handles sending emails via SMTP
 */
import nodemailer from 'nodemailer';
import config from '../config/config.js';

/**
 * Create Email Transporter
 */
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

/**
 * Send Email
 */
export const sendEmail = async (options) => {
  const { to, subject, html, text } = options;

  try {
    const mailOptions = {
      from: `${config.email.from.name} <${config.email.from.email}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Email Templates
 */

export const sendWelcomeEmail = async (email, firstName) => {
  const html = `
    <h2>Welcome to KYSB Fitness Center!</h2>
    <p>Hi ${firstName},</p>
    <p>Your account has been created successfully.</p>
    <p>You can now login to your member dashboard and manage your membership.</p>
    <p>Best regards,<br>KYSB Fitness Center Team</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to KYSB Fitness Center',
    html,
  });
};

export const sendPaymentReminderEmail = async (email, memberName, dueAmount) => {
  const html = `
    <h2>Payment Reminder</h2>
    <p>Hi ${memberName},</p>
    <p>Your membership fee of PKR ${dueAmount} is pending.</p>
    <p>Please make payment as soon as possible to keep your membership active.</p>
    <p>You can submit payment proof through your member dashboard.</p>
    <p>Best regards,<br>KYSB Fitness Center Team</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Monthly Membership Fee Reminder',
    html,
  });
};

export const sendPaymentApprovedEmail = async (email, memberName, amount, receiptNumber) => {
  const html = `
    <h2>Payment Approved</h2>
    <p>Hi ${memberName},</p>
    <p>Your payment of PKR ${amount} has been approved.</p>
    <p>Receipt Number: ${receiptNumber}</p>
    <p>Thank you for your payment!</p>
    <p>Best regards,<br>KYSB Fitness Center Team</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Payment Approved',
    html,
  });
};

export const sendPaymentRejectedEmail = async (email, memberName, reason) => {
  const html = `
    <h2>Payment Verification Failed</h2>
    <p>Hi ${memberName},</p>
    <p>Your payment submission has been rejected.</p>
    <p>Reason: ${reason}</p>
    <p>Please verify your payment details and resubmit.</p>
    <p>Best regards,<br>KYSB Fitness Center Team</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Payment Verification Failed',
    html,
  });
};

export const sendNewMemberNotificationEmail = async (adminEmail, memberName, memberEmail) => {
  const html = `
    <h2>New Member Registration</h2>
    <p>A new member has registered:</p>
    <p><strong>Name:</strong> ${memberName}</p>
    <p><strong>Email:</strong> ${memberEmail}</p>
    <p>Please verify and activate the member account.</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: 'New Member Registration',
    html,
  });
};
