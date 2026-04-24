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
// Gemini AI Setup
// =============================================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// =============================================
// Email OTP Setup
// =============================================
const otps = {};

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
// OTP Endpoints
// =============================================
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

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

app.post('/verify-otp', (req, res) => {
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
// AI Chat Endpoint (Gemini)
// =============================================
app.post('/api/chat', async (req, res) => {
  const { message, moduleContext } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const systemPrompt = `You are an expert Indian Election Process Education tutor. The user is currently learning about "${moduleContext || 'Indian Elections'}". 
    
Your responses should be:
- Clear, concise, and educational
- Focused on Indian elections, the Election Commission of India, Indian Constitution, EVMs, and democratic principles
- Reference Indian laws like Representation of the People Act, Article 324, Model Code of Conduct when relevant
- Friendly and encouraging
- If asked about something unrelated to elections or civics, politely redirect to election topics
- Use simple language suitable for Indian students
- Keep responses under 200 words unless the user asks for detail`;

  // Try multiple models in order of preference
  const modelsToTry = ['gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { text: systemPrompt },
        { text: message }
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// =============================================
// Start Server
// =============================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
