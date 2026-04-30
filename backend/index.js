/**
 * @module index
 * @description Main entry point for the Election Education backend server.
 * Configures Express with security middleware, mounts modular route handlers,
 * and serves the built React frontend as static files.
 *
 * Architecture:
 * - middleware/rateLimit.js — Per-IP rate limiting
 * - routes/otp.js          — OTP send/verify endpoints
 * - routes/ai.js           — Gemini AI chat & quiz explanation endpoints
 * - routes/email.js        — Welcome email endpoint
 * - utils/validation.js    — Shared input validation
 * - utils/otpStore.js      — In-memory OTP storage with cleanup
 *
 * @requires express
 * @requires cors
 * @requires helmet
 * @requires nodemailer
 * @requires @google/generative-ai
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Internal modules
const { startCleanupTimer } = require('./middleware/rateLimit');
const { startOtpCleanup } = require('./utils/otpStore');
const createOtpRoutes = require('./routes/otp');
const createAiRoutes = require('./routes/ai');
const createEmailRoutes = require('./routes/email');

// =============================================
// Express App Configuration
// =============================================
const app = express();

/**
 * Security headers via Helmet.
 * Content Security Policy is relaxed for inline styles in the React SPA.
 */
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

/**
 * CORS configuration — restricts origins in production, allows all in development.
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(cors({
  origin: allowedOrigins.length > 0
    ? (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    : true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// =============================================
// External Service Initialization
// =============================================

/**
 * Initialize Google Generative AI client.
 * @type {GoogleGenerativeAI|null}
 */
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not set. AI features will not work until added.');
}

/**
 * Configure Nodemailer SMTP transporter for Gmail.
 * Used by OTP and welcome email routes.
 * @type {import('nodemailer').Transporter}
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =============================================
// Mount Routes
// =============================================
app.use(createOtpRoutes(transporter));
app.use(createAiRoutes(genAI));
app.use(createEmailRoutes(transporter));

// =============================================
// Serve React App (Catch-all for client-side routing)
// =============================================
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// =============================================
// Periodic Cleanup Timers
// =============================================
startCleanupTimer();
startOtpCleanup();

// =============================================
// Start Server
// =============================================

/** @constant {number} PORT - Server port (defaults to 8080 for Cloud Run) */
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
