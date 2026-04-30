/**
 * @module routes/email
 * @description Express router for email-related endpoints.
 * Provides the welcome email endpoint that sends a beautifully
 * designed onboarding email to new users upon first login.
 */

const express = require('express');
const { rateLimit } = require('../middleware/rateLimit');
const { isValidEmail } = require('../utils/validation');

const router = express.Router();

/**
 * Creates the welcome email route with the injected transporter.
 *
 * @param {import('nodemailer').Transporter} transporter - Nodemailer transporter instance
 * @returns {import('express').Router} Configured Express router
 */
function createEmailRoutes(transporter) {
  /**
   * @route POST /api/welcome-email
   * @description Sends a styled HTML welcome email to new users.
   * Rate limited to 5 requests per minute per IP.
   *
   * @param {Object} req.body
   * @param {string} req.body.email - Recipient email address
   * @param {string} [req.body.name] - User's display name for personalization
   * @returns {Object} Success message or error
   */
  router.post('/api/welcome-email', rateLimit, async (req, res) => {
    const { email, name } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!isValidEmail(email)) return res.status(400).json({ error: 'Invalid email format' });

    const mailOptions = {
      from: `"Election Education" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🏛️ Welcome to the Election Process Education Assistant!',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0b1120 0%, #1a1a3e 100%); color: #f1f5f9; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px 40px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; color: #fff;">🏛️ Election Education</h1>
            <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Your Journey into Indian Democracy Starts Now</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #3b82f6; margin-top: 0;">Welcome, ${name || 'Learner'}! 🎉</h2>
            <p style="color: #cbd5e1; line-height: 1.7; font-size: 15px;">
              Thank you for joining the <strong style="color: #f1f5f9;">Election Process Education Assistant</strong>. 
              You're about to embark on an exciting journey to understand how the world's largest democracy works!
            </p>
            <div style="background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #3b82f6; margin-top: 0; font-size: 16px;">📚 What You'll Learn:</h3>
              <ul style="color: #94a3b8; line-height: 2; padding-left: 20px; margin: 0;">
                <li>How <strong style="color: #f1f5f9;">Article 324</strong> empowers the Election Commission of India</li>
                <li>The complete <strong style="color: #f1f5f9;">voter registration</strong> process</li>
                <li>Indian election laws & the <strong style="color: #f1f5f9;">Model Code of Conduct</strong></li>
                <li>How <strong style="color: #f1f5f9;">EVMs & VVPATs</strong> ensure fair elections</li>
                <li>The counting process & result declaration</li>
              </ul>
            </div>
            <div style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #10b981; margin-top: 0; font-size: 16px;">🎮 Interactive Features:</h3>
              <ul style="color: #94a3b8; line-height: 2; padding-left: 20px; margin: 0;">
                <li>🗳️ <strong style="color: #f1f5f9;">EVM Simulator</strong> — Cast a virtual vote!</li>
                <li>✅ <strong style="color: #f1f5f9;">Eligibility Checker</strong> — Can you vote?</li>
                <li>🤖 <strong style="color: #f1f5f9;">AI Tutor</strong> — Ask anything about Indian elections</li>
                <li>🎓 <strong style="color: #f1f5f9;">PDF Certificate</strong> — Earn it by completing all modules</li>
              </ul>
            </div>
            <p style="color: #64748b; font-size: 13px; margin-top: 30px; text-align: center;">
              Election Process Education • Prompt Wars Hackathon 2026
            </p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Welcome email sent successfully' });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      res.status(500).json({ error: 'Failed to send welcome email' });
    }
  });

  return router;
}

module.exports = createEmailRoutes;
