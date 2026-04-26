require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// =============================================
// Rate Limiting (in-memory, per IP)
// =============================================
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 OTPs per minute per IP

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  // Clean old entries
  const timestamps = rateLimitMap.get(ip).filter(t => t > windowStart);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
  }

  timestamps.push(now);
  next();
}

// Clean up rate limit map periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const valid = timestamps.filter(t => t > windowStart);
    if (valid.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, valid);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

// =============================================
// Gemini AI Setup
// =============================================
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
  console.warn("WARNING: GEMINI_API_KEY is not set. AI features will not work until added.");
}

// =============================================
// Email OTP Setup
// =============================================
const otps = {};

// Clean expired OTPs every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const email of Object.keys(otps)) {
    if (now > otps[email].expiresAt) {
      delete otps[email];
    }
  }
}, 10 * 60 * 1000);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// =============================================
// OTP Endpoints (rate-limited)
// =============================================
app.post('/send-otp', rateLimit, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const otp = generateOTP();
  otps[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

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

app.post('/verify-otp', rateLimit, (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  const record = otps[email];
  if (!record) return res.status(400).json({ error: 'No OTP found for this email' });
  if (Date.now() > record.expiresAt) {
    delete otps[email];
    return res.status(400).json({ error: 'OTP has expired' });
  }

  if (record.otp === otp) {
    delete otps[email];
    res.json({ message: 'OTP verified successfully', success: true });
  } else {
    res.status(400).json({ error: 'Invalid OTP' });
  }
});

// =============================================
// Welcome Email Endpoint
// =============================================
app.post('/api/welcome-email', rateLimit, async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

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

// =============================================
// AI Chat Endpoint (Gemini)
// =============================================
app.post('/api/chat', async (req, res) => {
  const { message, moduleContext } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  // Sanitize input — limit length to prevent prompt injection abuse
  const sanitizedMessage = message.slice(0, 2000).trim();

  const systemPrompt = `You are an expert Indian Election Process Education tutor. The user is currently learning about "${moduleContext || 'Indian Elections'}". 
    
Your responses should be:
- Clear, concise, and educational
- Focused on Indian elections, the Election Commission of India, Indian Constitution, EVMs, and democratic principles
- Reference Indian laws like Representation of the People Act, Article 324, Model Code of Conduct when relevant
- Friendly and encouraging
- If asked about something unrelated to elections or civics, politely redirect to election topics
- Use simple language suitable for Indian students
- Keep responses under 200 words unless the user asks for detail`;

  if (!genAI) {
    return res.status(500).json({ 
      error: 'AI is not configured',
      reply: 'AI features are currently unavailable because the API key is not set.' 
    });
  }

  // Try multiple models in order of preference
  const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: sanitizedMessage }
      ]);
      const reply = result.response.text();
      return res.json({ reply });
    } catch (error) {
      console.warn(`Model ${modelName} failed:`, error.message);
      continue; // Try the next model
    }
  }

  // All models failed
  res.status(500).json({ 
    error: 'All AI models are currently unavailable',
    reply: 'I\'m currently experiencing high demand. Please try again in a few seconds.' 
  });
});

// =============================================
// Serve React App (Catch-all)
// =============================================
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// =============================================
// Start Server
// =============================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
