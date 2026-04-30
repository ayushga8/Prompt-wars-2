# 🏛️ Election Process Education Assistant

### AI-Powered Interactive Platform for Learning Indian Democracy

> **Prompt Wars Hackathon 2026** | Built with Google Gemini AI, React, Firebase & Google Cloud Run

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Cloud_Run-4285F4?style=for-the-badge)](https://prompt-wars-2-455956461967.asia-south1.run.app)
[![GitHub](https://img.shields.io/badge/GitHub-Source_Code-181717?style=for-the-badge&logo=github)](https://github.com/ayushga8/Prompt-wars-2)
[![Tests](https://img.shields.io/badge/Tests-68_Passing-10B981?style=for-the-badge)](https://github.com/ayushga8/Prompt-wars-2)
[![PWA](https://img.shields.io/badge/PWA-Installable-8B5CF6?style=for-the-badge)](https://prompt-wars-2-455956461967.asia-south1.run.app)
[![Languages](https://img.shields.io/badge/Languages-EN_|_हिन्दी_|_தமிழ்-F59E0B?style=for-the-badge)](https://prompt-wars-2-455956461967.asia-south1.run.app)

---

## 📌 Problem Statement

India is the **world's largest democracy** with **96.9 crore registered voters**, yet civic literacy remains alarmingly low. Many first-time voters don't understand how elections actually work — from voter registration to EVM operation to vote counting. Traditional civic education is static, text-heavy, and fails to engage the digital-native generation.

**Critical accessibility gap:** Over 57% of India's population speaks Hindi, Tamil, or another regional language as their primary language, yet most civic education content is only available in English.

**How might we make election education interactive, engaging, and accessible for every Indian citizen — regardless of the language they speak?**

---

## 💡 Our Solution

The **Election Process Education Assistant** is a full-stack, AI-powered web application that transforms election education into a **gamified, hands-on learning experience**. It covers the complete Indian election lifecycle through interactive modules, real-time AI tutoring, and simulation-based learning — all available in **English, Hindi (हिन्दी), and Tamil (தமிழ்)**.

### 🎯 Key Differentiators
| Feature | Traditional Education | Our Solution |
|---|---|---|
| Content Delivery | Static PDFs/textbooks | Interactive timelines with animations |
| Language | English-only | **English, Hindi, Tamil — full i18n** |
| Assessment | Paper-based MCQs | Gamified quizzes with **AI-powered explanations** |
| Voting Experience | Theoretical description | **Functional EVM Simulator with VVPAT** |
| Doubt Resolution | Wait for teacher | **Real-time AI Tutor (Gemini) in your language** |
| Accessibility | Classroom-only | **Text-to-speech, PWA offline access, WCAG-compliant** |
| Motivation | None | Badges, progress tracking, PDF certificate |

---

## ✨ Features

### 🌐 Multi-Language Support (English, Hindi, Tamil)
The entire application is available in **three languages**, making election education accessible to over 800 million speakers:
- **Full UI Translation** — Every button, label, heading, and error message
- **Complete Module Content** — All 6 modules with explanations, timelines, and quizzes translated
- **AI Responds in Your Language** — Gemini AI tutor answers in Hindi/Tamil/English
- **Certificate in English or Hindi** — Choose your PDF certificate language
- **Noto Sans Fonts** — Google Fonts for crisp Devanagari & Tamil script rendering
- **Language preference persisted** in localStorage across sessions

### 🔊 Text-to-Speech Accessibility
- **Read Aloud** button (🔊) next to every module explanation
- Uses the browser's built-in `speechSynthesis` API — zero external dependencies
- Supports **Hindi, Tamil, and English** voice output
- Pulsing animation while speaking, click to stop
- *"A farmer in Tamil Nadu who can't read English can listen to election education in Tamil"*

### 📚 6 Comprehensive Learning Modules
Each module covers a critical phase of the Indian election process with step-by-step animated timelines and knowledge-check quizzes:

1. **🏛️ Overview** — Constitution, Article 324, Election Commission of India
2. **📝 Voter Registration** — Form 6, EPIC card, eligibility requirements
3. **⚖️ Election Laws** — Representation of the People Act, Model Code of Conduct, 10th Schedule
4. **📢 Campaigns & Rallies** — Expenditure limits, media regulations, exit polls
5. **🗳️ Voting Process** — EVM operation, VVPAT verification, polling day procedures
6. **🏆 Counting & Results** — Postal ballots, EVM tallying, result declaration

### 🗳️ Interactive EVM Simulator
A **fully functional Electronic Voting Machine simulation** that replicates the real Indian EVM experience:
- Realistic Balloting Unit interface with candidate list
- Button-press interaction to select a candidate (including NOTA)
- **VVPAT slip animation** with a 7-second verification window
- Confirmation flow mimicking actual polling booth experience
- Confetti celebration on successful vote cast
- **Full keyboard navigation support** for accessibility

### 🤖 AI-Powered Election Tutor with Quiz Explanations
- Powered by **Google Gemini AI** (multi-model fallback: gemini-1.5-flash → gemini-2.0-flash-lite)
- Contextually aware — knows which module the user is currently studying
- **Multilingual AI responses** — responds in Hindi, Tamil, or English based on user's language
- Trained with a custom system prompt focused on **Indian Civics, ECI processes, and Constitutional law**
- **AI Quiz Explanations** — When a student answers a quiz question wrong, the AI explains:
  - Why their answer was incorrect
  - Why the correct answer is right
  - Relevant facts about Indian elections
  - All in the user's selected language
- **Input sanitization** to prevent prompt injection abuse

### ✅ Voter Eligibility Checker
- Enter your date of birth and citizenship status
- Automatically calculates eligibility based on the **January 1st qualifying date** rule
- Provides actionable guidance on how to register if eligible

### 📊 Election Statistics Dashboard
- **Animated counter cards** with intersection observer-triggered count-up animations
- Key stats: 96.9 Cr voters, 10.35 Lakh polling stations, 55 Lakh EVMs, 543 Lok Sabha seats, 2,800+ parties
- Fully translated stat labels in all languages

### 🎓 PDF Certificate of Completion
- Unlocks after completing all 5 learning modules
- Canvas-rendered certificate with the user's name, date, and badges earned
- **Choose certificate language** — English or Hindi
- **Downloadable as a professional PDF document** using jsPDF
- Confetti animation on download

### 📱 Progressive Web App (PWA)
- **Installable** on mobile home screens (Android, iOS, Desktop)
- **Offline support** — Service worker caches pages with network-first strategy
- Custom app icon and splash screen
- *"Works without internet in rural India"*

### 🏅 Gamification Engine
- **Badge system** — Earn unique badges for each completed module
- **Progress bar** — Visual tracking across all modules
- **Persistent state** — Progress saved to Firebase Firestore, restored on login

### 🔐 Dual Authentication
- **Google Sign-In** — One-click authentication via Firebase Auth
- **Email OTP** — Custom OTP-based login with styled HTML emails via Nodemailer
- **Welcome Email** — Beautifully designed onboarding email on first login
- **Rate limiting** — 5 requests/minute/IP to prevent abuse

### 🌗 Dark / Light Theme
- Toggle between dark and light modes
- Smooth CSS transitions across all components
- Theme preference persisted in localStorage

### ♿ Accessibility
- **WCAG 2.1 compliant** — ARIA labels, roles, and landmarks throughout
- **Text-to-Speech** — Read module content aloud in Hindi, Tamil, or English
- **Keyboard navigation** — All interactive elements (EVM buttons, sidebar, forms) operable via keyboard
- **Screen reader support** — `sr-only` labels, `aria-live` regions for dynamic content
- **Focus indicators** — Visible focus outlines for keyboard users
- **Semantic HTML** — Proper heading hierarchy, landmark roles, form labels

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI architecture |
| **Vite 8** | Lightning-fast build tool & dev server |
| **React Context** | Lightweight i18n system (no external libraries) |
| **Web Speech API** | Text-to-speech in 3 languages |
| **Canvas API** | Certificate generation |
| **jsPDF** | PDF export for certificates |
| **canvas-confetti** | Celebration animations |
| **Firebase Auth** | Google Sign-In integration |
| **Firebase Firestore** | Real-time user data persistence |
| **Vitest** | Unit & component testing framework |
| **Testing Library** | React component testing utilities |
| **Service Worker** | PWA offline caching |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **Google Gemini AI** | AI tutoring + quiz explanations with multi-model fallback |
| **Nodemailer** | OTP delivery & welcome emails |
| **dotenv** | Secure environment variable management |
| **Rate Limiting** | Custom middleware for abuse prevention |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Google Cloud Run** | Serverless container deployment |
| **Docker** | Multi-stage containerization |
| **GitHub** | Version control & CI/CD trigger |
| **Firebase** | BaaS for auth & database |
| **Google Fonts** | Noto Sans Devanagari & Tamil for i18n |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Google Cloud Run                    │
│  ┌───────────────────────────────────────────────┐   │
│  │              Docker Container                  │   │
│  │  ┌─────────────────┐  ┌────────────────────┐  │   │
│  │  │   React Frontend │  │  Express Backend   │  │   │
│  │  │   (Static Files) │  │                    │  │   │
│  │  │                  │  │  /api/chat → Gemini│  │   │
│  │  │  i18n: EN/HI/TA │  │  /api/explain →    │  │   │
│  │  │  Auth → Firebase │  │    Gemini (Quiz AI)│  │   │
│  │  │  Data → Firestore│  │  /send-otp → SMTP  │  │   │
│  │  │  TTS → Web Speech│  │  /verify-otp       │  │   │
│  │  │  PWA → SW Cache  │  │  /api/welcome-email │  │   │
│  │  └─────────────────┘  └────────────────────┘  │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
   Firebase Auth            Google Gemini AI
   Firebase Firestore       Gmail SMTP
```

---

## 🧪 Testing

The project includes a comprehensive test suite with **68 tests across 12 test files** spanning both frontend and backend:

```bash
# Frontend tests (44 tests, 9 files)
cd frontend && npm test

 ✓ src/test/modules.test.js (6 tests)              # Data integrity
 ✓ src/test/Quiz.test.jsx (6 tests)                # Quiz logic + UI
 ✓ src/test/EligibilityChecker.test.jsx (5 tests)  # Component logic
 ✓ src/test/EVMSimulator.test.jsx (4 tests)        # UI interactions
 ✓ src/test/ErrorBoundary.test.jsx (2 tests)       # Error handling
 ✓ src/test/Sidebar.test.jsx (7 tests)             # Navigation + keyboard
 ✓ src/test/ChatPanel.test.jsx (6 tests)           # AI chat UI
 ✓ src/test/Certificate.test.jsx (5 tests)         # PDF cert states
 ✓ src/test/TextToSpeech.test.jsx (3 tests)        # TTS button

 Test Files  9 passed (9)
      Tests  44 passed (44)

# Backend tests (24 tests, 3 files)
cd backend && npx vitest run

 ✓ test/validation.test.js (10 tests)              # Input validation
 ✓ test/otpStore.test.js (10 tests)                # OTP lifecycle
 ✓ test/rateLimit.test.js (4 tests)                # Rate limiting

 Test Files  3 passed (3)
      Tests  24 passed (24)
```

### Test Coverage
| Test Suite | What's Tested |
|---|---|
| **Modules Data** | Module count, structure, quiz format, required fields, timeline integrity |
| **Quiz** | Rendering, submit logic, correct/wrong answer paths, AI explanation trigger, retry reset |
| **Eligibility Checker** | Rendering, disabled states, eligible/non-citizen/underage outcomes |
| **EVM Simulator** | State transitions, candidate selection, keyboard navigation |
| **Error Boundary** | Normal rendering, crash fallback UI |
| **Sidebar** | Module list rendering, progress bar, active state, completion marks, click + keyboard nav |
| **ChatPanel** | Panel rendering, greeting message, input/send controls, close handler |
| **Certificate** | Locked/ready states, progress bar, language selection, user name display |
| **TextToSpeech** | Rendering, browser support detection, icon state |
| **Validation Utils** | Email validation, OTP validation, message sanitization, constants |
| **OTP Store** | OTP generation, creation, verification, expiry, deletion |
| **Rate Limiter** | Allow under limit, block at limit, per-IP isolation |

---

## 🔒 Security

| Feature | Implementation |
|---|---|
| **HTTP Security Headers** | Helmet middleware applies X-Content-Type-Options, X-Frame-Options, HSTS, and more |
| **Environment Variables** | Firebase config and API keys loaded from `.env` files, never hardcoded |
| **Rate Limiting** | Custom middleware: 5 requests/minute/IP on sensitive endpoints |
| **Input Sanitization** | AI chat messages truncated to 2,000 characters via centralized validation |
| **Email Validation** | Centralized regex validation before OTP dispatch |
| **Error Boundaries** | React ErrorBoundary prevents white-screen crashes |
| **Memory Management** | Periodic cleanup of expired OTPs and rate limit entries |
| **CORS** | Configurable origin whitelist via ALLOWED_ORIGINS environment variable |
| **PropTypes** | Runtime prop validation on all React components |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Google AI Studio API Key ([Get one here](https://aistudio.google.com/apikey))
- A Firebase project with Authentication & Firestore enabled
- A Gmail account with an App Password for SMTP

### Local Development

```bash
# Clone the repository
git clone https://github.com/ayushga8/Prompt-wars-2.git
cd Prompt-wars-2

# Setup backend
cd backend
cp .env.example .env
# Edit .env with your credentials
npm install

# Setup frontend
cd ../frontend
cp .env.example .env
# Edit .env with your Firebase credentials
npm install

# Run both (in separate terminals)
cd backend && node index.js      # Starts on port 8080
cd frontend && npm run dev       # Starts on port 5173

# Run tests
cd frontend && npm test
```

### Environment Variables

Create `backend/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
GEMINI_API_KEY=your-gemini-api-key
PORT=8080
```

Create `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Production Deployment (Google Cloud Run)

```bash
# The project includes a multi-stage Dockerfile
# Cloud Run auto-detects and builds it

# Option 1: Via GitHub continuous deployment
# Connect your repo in Cloud Console → Cloud Run

# Option 2: Via gcloud CLI
gcloud run deploy prompt-wars-2 \
  --source . \
  --region asia-south1 \
  --set-env-vars GEMINI_API_KEY=xxx,EMAIL_USER=xxx,EMAIL_PASS=xxx
```

---

## 📂 Project Structure

```
Promptwars-2/
├── Dockerfile                  # Multi-stage production build
├── .dockerignore
├── .gitignore
├── frontend/
│   ├── index.html              # PWA manifest + service worker registration
│   ├── vite.config.js          # Dev proxy + Vitest config
│   ├── package.json
│   ├── .env                    # Firebase credentials (gitignored)
│   ├── .env.example            # Template for Firebase setup
│   ├── public/
│   │   ├── manifest.json       # PWA manifest
│   │   ├── sw.js               # Service worker (network-first + cache)
│   │   ├── icon-192.png        # PWA icon (192x192)
│   │   └── icon-512.png        # PWA icon (512x512)
│   └── src/
│       ├── main.jsx            # React entry with LanguageProvider
│       ├── App.jsx             # Main app with auth, routing & i18n
│       ├── firebase.js         # Firebase init (env-based config)
│       ├── index.css           # Design system + TTS + language switcher styles
│       ├── data/
│       │   ├── modules.js      # Dynamic module loader (getModules(lang))
│       │   └── modules_en.js   # English module content
│       ├── i18n/
│       │   ├── LanguageContext.jsx  # React Context provider + useLanguage hook
│       │   ├── en.js           # English UI strings (130+ keys)
│       │   ├── hi.js           # Hindi UI strings
│       │   ├── ta.js           # Tamil UI strings
│       │   ├── modules_hi.js   # Hindi module content (all 6 modules)
│       │   └── modules_ta.js   # Tamil module content (all 6 modules)
│       ├── components/
│       │   ├── AuthView.jsx        # Google + OTP authentication (i18n)
│       │   ├── ErrorBoundary.jsx   # React error boundary
│       │   ├── LanguageSwitcher.jsx # 🌐 Language dropdown (EN/HI/TA)
│       │   ├── TextToSpeech.jsx    # 🔊 Read-aloud button component
│       │   ├── Sidebar.jsx         # Navigation with progress (i18n)
│       │   ├── ModuleContent.jsx   # Module renderer with TTS
│       │   ├── Timeline.jsx        # Animated step timeline
│       │   ├── Quiz.jsx            # Quiz engine + AI explanations
│       │   ├── ChatPanel.jsx       # AI tutor (multilingual Gemini)
│       │   ├── BadgeBar.jsx        # Badge display system
│       │   ├── EVMSimulator.jsx    # EVM + VVPAT simulation (i18n)
│       │   ├── ElectionStats.jsx   # Animated statistics (i18n)
│       │   ├── EligibilityChecker.jsx  # Voter eligibility tool (i18n)
│       │   └── Certificate.jsx     # PDF certificate (EN/HI choice)
│       └── test/
│           ├── setup.js                    # Test environment setup (canvas + scrollIntoView mocks)
│           ├── testUtils.jsx               # LanguageProvider test wrapper
│           ├── modules.test.js             # Data integrity tests
│           ├── Quiz.test.jsx               # Quiz logic + AI explanation tests
│           ├── EligibilityChecker.test.jsx # Component tests
│           ├── EVMSimulator.test.jsx       # Interaction tests
│           ├── ErrorBoundary.test.jsx      # Error handling tests
│           ├── Sidebar.test.jsx            # Navigation + keyboard tests
│           ├── ChatPanel.test.jsx          # AI chat UI tests
│           ├── Certificate.test.jsx        # PDF certificate state tests
│           └── TextToSpeech.test.jsx       # TTS button tests
└── backend/
    ├── index.js                # Express app entry (modular architecture)
    ├── package.json
    ├── vitest.config.js        # Backend test configuration
    ├── .env                    # Secrets (gitignored)
    ├── .env.example            # Template for environment setup
    ├── middleware/
    │   └── rateLimit.js        # Per-IP rate limiting middleware
    ├── routes/
    │   ├── otp.js              # OTP send/verify endpoints
    │   ├── ai.js               # Gemini AI chat + quiz explanation endpoints
    │   └── email.js            # Welcome email endpoint
    ├── utils/
    │   ├── validation.js       # Shared input validation utilities
    │   └── otpStore.js         # In-memory OTP storage with cleanup
    └── test/
        ├── validation.test.js  # Input validation tests
        ├── otpStore.test.js    # OTP lifecycle tests
        └── rateLimit.test.js   # Rate limiting tests
```

---

## 🎥 Demo Walkthrough

1. **Sign In** → Authenticate via Google or Email OTP
2. **Choose Your Language** → Switch between English, Hindi, or Tamil
3. **Explore Overview** → See election stats, timeline, and certificate status
4. **Listen to Content** → Click 🔊 to hear module content read aloud
5. **Learn Modules** → Read through animated timelines for each election phase
6. **Check Eligibility** → Use the interactive voter eligibility tool
7. **Simulate Voting** → Cast a vote on the EVM Simulator with VVPAT
8. **Pass Quizzes** → Answer India-specific MCQs to earn badges
9. **Learn from Mistakes** → AI explains why wrong answers are incorrect
10. **Ask the AI** → Open the chat panel and ask Gemini about elections (in your language)
11. **Download Certificate** → Complete all modules and download your PDF certificate (EN/HI)
12. **Install as App** → Add to home screen for offline access

---

## 🏆 Hackathon Alignment

| Criteria | How We Address It |
|---|---|
| **Innovation** | First-of-its-kind EVM simulator + AI election tutor + multilingual TTS combo |
| **Technical Complexity** | Full-stack React + Express + Gemini AI + Firebase + i18n + PWA + Docker + Cloud Run |
| **Real-World Impact** | Directly addresses voter illiteracy among 800M+ Hindi/Tamil speakers |
| **UI/UX Quality** | Premium glassmorphism dark/light theme with micro-animations |
| **Completeness** | Auth, database, AI, gamification, i18n, TTS, PWA, testing, deployment — all production-ready |
| **AI Integration** | Gemini for tutoring + quiz explanations, multilingual responses, multi-model fallback |
| **Accessibility** | 3 languages, text-to-speech, keyboard nav, screen reader support, PWA offline |
| **Scalability** | Serverless Cloud Run deployment scales to zero and up automatically |
| **Code Quality** | 68 tests (12 suites), ESLint, PropTypes, JSDoc, modular backend architecture, useCallback/useMemo optimizations |
| **Security** | Helmet security headers, env-based secrets, rate limiting, input sanitization, configurable CORS, PropTypes validation |

---

## 🌟 What's Next

- [x] ~~Multi-language support (Hindi, Tamil)~~ ✅
- [x] ~~Text-to-Speech for accessibility~~ ✅
- [x] ~~PWA support for offline module access~~ ✅
- [x] ~~AI-powered quiz explanations~~ ✅
- [ ] State-level election content (Vidhan Sabha specifics)
- [ ] Leaderboard system for competitive learning
- [ ] Voice-based AI interaction (speech-to-text input)
- [ ] More languages (Bengali, Telugu, Marathi)
- [ ] Integration with actual ECI voter registration portal

---

## 👨‍💻 Author

**Ayush** — Built with ❤️ for Indian Democracy

---

## 📄 License

This project is built for the Prompt Wars Hackathon 2026.
