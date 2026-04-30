/**
 * @module routes/otp
 * @description Express router for OTP-based email authentication.
 * Provides endpoints for sending and verifying one-time passwords
 * via email, with rate limiting to prevent abuse.
 */

const express = require('express');
const { rateLimit } = require('../middleware/rateLimit');
const { isValidEmail, isValidOtp } = require('../utils/validation');
const { createOTP, verifyOTP } = require('../utils/otpStore');

const router = express.Router();

/**
 * Creates the email transporter-dependent OTP routes.
 * Uses dependency injection for the transporter to enable testing.
 *
 * @param {import('nodemailer').Transporter} transporter - Nodemailer transporter instance
 * @returns {import('express').Router} Configured Express router
 */
function createOtpRoutes(transporter) {
  /**
   * @route POST /send-otp
   * @description Generates and sends a 6-digit OTP to the provided email address.
   * Rate limited to 5 requests per minute per IP.
   *
   * @param {Object} req.body
   * @param {string} req.body.email - Recipient email address
   * @returns {Object} Success message or error
   */
  router.post('/send-otp', rateLimit, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const otp = createOTP(email);

    const mailOptions = {
      from: `"Election Education" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Election Education Assistant OTP',
      html: `
        <div style="font-family: 'Inter', sans-serif; padding: 30px; background: #0b1120; color: #f1f5f9; border-radius: 12px;">
          <h2 style="color: #3b82f6;">Election Process Education</h2>
          <p>Your One-Time Password (OTP) for signing in is:</p>
          <h1 style="color: #10b981; letter-spacing: 4px; font-size: 2.5rem;">${otp}</h1>
          <p style="color: #94a3b8;">This code will expire in 5 minutes.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  });

  /**
   * @route POST /verify-otp
   * @description Verifies a submitted OTP against the stored value.
   * OTP is deleted after successful verification or expiry.
   * Rate limited to 5 requests per minute per IP.
   *
   * @param {Object} req.body
   * @param {string} req.body.email - Email address the OTP was sent to
   * @param {string} req.body.otp - The 6-digit OTP code to verify
   * @returns {Object} Verification result with success boolean
   */
  router.post('/verify-otp', rateLimit, (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });
    if (!isValidOtp(otp)) return res.status(400).json({ error: 'OTP must be 6 digits' });

    const result = verifyOTP(email, otp);
    if (result.success) {
      res.json({ message: 'OTP verified successfully', success: true });
    } else {
      res.status(400).json({ error: result.error });
    }
  });

  return router;
}

module.exports = createOtpRoutes;
