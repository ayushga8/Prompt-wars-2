# 🏛️ Election Process Education Assistant

### AI-Powered Interactive Platform for Learning Indian Democracy

> **Prompt Wars Hackathon 2026** | Built with Google Gemini AI, React, Firebase & Google Cloud Run

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Cloud_Run-4285F4?style=for-the-badge)](https://prompt-wars-2-455956461967.asia-south1.run.app)
[![GitHub](https://img.shields.io/badge/GitHub-Source_Code-181717?style=for-the-badge&logo=github)](https://github.com/ayushga8/Prompt-wars-2)
[![Tests](https://img.shields.io/badge/Tests-17_Passing-10B981?style=for-the-badge)](https://github.com/ayushga8/Prompt-wars-2)

---

## 📌 Problem Statement

India is the **world's largest democracy** with **96.9 crore registered voters**, yet civic literacy remains alarmingly low. Many first-time voters don't understand how elections actually work — from voter registration to EVM operation to vote counting. Traditional civic education is static, text-heavy, and fails to engage the digital-native generation.

**How might we make election education interactive, engaging, and accessible for every Indian citizen?**

---

## 💡 Our Solution

The **Election Process Education Assistant** is a full-stack, AI-powered web application that transforms election education into a **gamified, hands-on learning experience**. It covers the complete Indian election lifecycle through interactive modules, real-time AI tutoring, and simulation-based learning.

### 🎯 Key Differentiators
| Feature | Traditional Education | Our Solution |
|---|---|---|
| Content Delivery | Static PDFs/textbooks | Interactive timelines with animations |
| Assessment | Paper-based MCQs | Gamified quizzes with instant feedback |
| Voting Experience | Theoretical description | **Functional EVM Simulator with VVPAT** |
| Doubt Resolution | Wait for teacher | **Real-time AI Tutor (Gemini)** |
| Motivation | None | Badges, progress tracking, PDF certificate |
| Accessibility | Classroom-only | **24/7 web access, any device, WCAG-compliant** |

---

## ✨ Features

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

### 🤖 AI-Powered Election Tutor
- Powered by **Google Gemini AI** (multi-model fallback: gemini-1.5-flash → gemini-2.0-flash-lite)
- Contextually aware — knows which module the user is currently studying
- Trained with a custom system prompt focused on **Indian Civics, ECI processes, and Constitutional law**
- Handles questions about Article 324, EVMs, anti-defection law, NOTA, and more
- **Input sanitization** to prevent prompt injection abuse

### ✅ Voter Eligibility Checker
- Enter your date of birth and citizenship status
- Automatically calculates eligibility based on the **January 1st qualifying date** rule
- Provides actionable guidance on how to register if eligible

### 📊 Election Statistics Dashboard
- **Animated counter cards** with intersection observer-triggered count-up animations
- Key stats: 96.9 Cr voters, 10.35 Lakh polling stations, 55 Lakh EVMs, 543 Lok Sabha seats, 2,800+ parties

### 🎓 PDF Certificate of Completion
- Unlocks after completing all 5 learning modules
- Canvas-rendered certificate with the user's name, date, and badges earned
- **Downloadable as a professional PDF document** using jsPDF
- Confetti animation on download

### 🏅 Gamification Engine
- **Badge system** — Earn unique badges for each completed module
- **Progress bar** — Visual tracking across all modules
- **Persistent state** — Progress saved to Firebase Firestore, restored on login

### 🔐 Dual Authentication
- **Google Sign-In** — One-click authentication via Firebase Auth
- **Email OTP** — Custom OTP-based login with styled HTML emails via Nodemailer
- **Welcome Email** — Beautifully designed onboarding email on first login
- **Rate limiting** — 5 requests/minute/IP to prevent abuse

### ♿ Accessibility
- **WCAG 2.1 compliant** — ARIA labels, roles, and landmarks throughout
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
| **Canvas API** | Certificate generation |
| **jsPDF** | PDF export for certificates |
| **canvas-confetti** | Celebration animations |
| **Firebase Auth** | Google Sign-In integration |
| **Firebase Firestore** | Real-time user data persistence |
| **Vitest** | Unit & component testing framework |
| **Testing Library** | React component testing utilities |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **Google Gemini AI** | AI-powered tutoring with multi-model fallback |
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
│  │  │  Auth → Firebase │  │  /send-otp → SMTP  │  │   │
│  │  │  Data → Firestore│  │  /verify-otp       │  │   │
│  │  │                  │  │  /api/welcome-email │  │   │
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

The project includes a comprehensive test suite with **17 tests across 4 test files**:

```bash
npm test

 ✓ src/test/modules.test.js (6 tests)         # Data integrity
 ✓ src/test/EligibilityChecker.test.jsx (5 tests)  # Component logic
 ✓ src/test/EVMSimulator.test.jsx (4 tests)    # UI interactions
 ✓ src/test/ErrorBoundary.test.jsx (2 tests)   # Error handling

 Test Files  4 passed (4)
      Tests  17 passed (17)
```

### Test Coverage
| Test Suite | What's Tested |
|---|---|
| **Modules Data** | Module count, structure, quiz format, required fields, timeline integrity |
| **Eligibility Checker** | Rendering, disabled states, eligible/non-citizen/underage outcomes |
| **EVM Simulator** | State transitions, candidate selection, keyboard navigation |
| **Error Boundary** | Normal rendering, crash fallback UI |

---

## 🔒 Security

| Feature | Implementation |
|---|---|
| **Environment Variables** | Firebase config and API keys loaded from `.env` files, never hardcoded |
| **Rate Limiting** | Custom middleware: 5 requests/minute/IP on sensitive endpoints |
| **Input Sanitization** | AI chat messages truncated to 2,000 characters |
| **Email Validation** | Regex validation before OTP dispatch |
| **Error Boundaries** | React ErrorBoundary prevents white-screen crashes |
| **Memory Management** | Periodic cleanup of expired OTPs and rate limit entries |
| **CORS** | Configured for cross-origin request handling |

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
│   ├── index.html
│   ├── vite.config.js          # Dev proxy + Vitest config
│   ├── package.json
│   ├── .env                    # Firebase credentials (gitignored)
│   ├── .env.example            # Template for Firebase setup
│   └── src/
│       ├── main.jsx            # React entry point with ErrorBoundary
│       ├── App.jsx             # Main app with auth & routing
│       ├── firebase.js         # Firebase init (env-based config)
│       ├── index.css           # Complete design system + accessibility
│       ├── data/
│       │   └── modules.js      # India-specific educational content
│       ├── components/
│       │   ├── AuthView.jsx        # Google + OTP authentication
│       │   ├── ErrorBoundary.jsx   # React error boundary
│       │   ├── Sidebar.jsx         # Navigation with progress
│       │   ├── ModuleContent.jsx   # Module renderer
│       │   ├── Timeline.jsx        # Animated step timeline
│       │   ├── Quiz.jsx            # Interactive quiz engine
│       │   ├── ChatPanel.jsx       # AI tutor chat panel
│       │   ├── BadgeBar.jsx        # Badge display system
│       │   ├── EVMSimulator.jsx    # EVM + VVPAT simulation
│       │   ├── ElectionStats.jsx   # Animated statistics
│       │   ├── EligibilityChecker.jsx  # Voter eligibility tool
│       │   └── Certificate.jsx     # PDF certificate generator
│       └── test/
│           ├── setup.js                    # Test environment setup
│           ├── modules.test.js             # Data integrity tests
│           ├── EligibilityChecker.test.jsx  # Component tests
│           ├── EVMSimulator.test.jsx        # Interaction tests
│           └── ErrorBoundary.test.jsx       # Error handling tests
└── backend/
    ├── index.js                # Express server + rate limiting + all APIs
    ├── package.json
    ├── .env                    # Secrets (gitignored)
    └── .env.example            # Template for environment setup
```

---

## 🎥 Demo Walkthrough

1. **Sign In** → Authenticate via Google or Email OTP
2. **Explore Overview** → See election stats, timeline, and certificate status
3. **Learn Modules** → Read through animated timelines for each election phase
4. **Check Eligibility** → Use the interactive voter eligibility tool
5. **Simulate Voting** → Cast a vote on the EVM Simulator with VVPAT
6. **Pass Quizzes** → Answer India-specific MCQs to earn badges
7. **Ask the AI** → Open the chat panel and ask Gemini about elections
8. **Download Certificate** → Complete all modules and download your PDF certificate

---

## 🏆 Hackathon Alignment

| Criteria | How We Address It |
|---|---|
| **Innovation** | First-of-its-kind EVM simulator + AI election tutor combo |
| **Technical Complexity** | Full-stack React + Express + Gemini AI + Firebase + Docker + Cloud Run |
| **Real-World Impact** | Directly addresses voter illiteracy among 18-25 year olds |
| **UI/UX Quality** | Premium glassmorphism dark theme with micro-animations |
| **Completeness** | Auth, database, AI, gamification, testing, deployment — all production-ready |
| **AI Integration** | Google Gemini with multi-model fallback and custom civics persona |
| **Scalability** | Serverless Cloud Run deployment scales to zero and up automatically |
| **Code Quality** | 17 unit tests, error boundaries, rate limiting, input validation |
| **Security** | Env-based secrets, rate limiting, input sanitization, no hardcoded keys |
| **Accessibility** | WCAG 2.1 compliant with ARIA, keyboard nav, screen reader support |

---

## 🌟 What's Next

- [ ] Multi-language support (Hindi, Tamil, Bengali, etc.)
- [ ] State-level election content (Vidhan Sabha specifics)
- [ ] Leaderboard system for competitive learning
- [ ] Voice-based AI interaction for accessibility
- [ ] PWA support for offline module access
- [ ] Integration with actual ECI voter registration portal

---

## 👨‍💻 Author

**Ayush** — Built with ❤️ for Indian Democracy

---

## 📄 License

This project is built for the Prompt Wars Hackathon 2026.
