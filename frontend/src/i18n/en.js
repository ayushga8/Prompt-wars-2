const en = {
  // Language meta
  langName: 'English',
  langCode: 'en',

  // App / Navbar
  appTitle: 'Election Assistant',
  signOut: 'Sign Out',
  loading: 'Loading...',

  // Auth
  authTitle: 'Election Process Education',
  authSubtitle: 'Understand the election process, timelines, and steps in an interactive and easy-to-follow way.',
  signIn: 'Sign In',
  signInGoogle: 'Sign in with Google',
  or: 'OR',
  firstName: 'First Name',
  lastName: 'Last Name',
  emailPlaceholder: 'Enter your email address',
  sendOtp: 'Send OTP via Email',
  sending: 'Sending...',
  otpSentTo: 'An OTP has been sent to',
  enterOtp: 'Enter 6-digit OTP',
  verifyOtp: 'Verify OTP',
  verifying: 'Verifying...',
  back: '← Back',
  errorName: 'Please enter your first and last name.',
  errorEmail: 'Please enter a valid email address.',
  errorOtp: 'Please enter a 6-digit OTP.',
  errorServer: 'Unable to reach the server. Please try again later.',
  errorOtpFailed: 'Failed to send OTP.',
  errorOtpInvalid: 'Invalid OTP.',

  // Sidebar
  learningModules: 'Learning Modules',
  progress: 'Progress',

  // ModuleContent
  welcomeTitle: 'Welcome to the Election Process Explorer!',
  checkEligibilityTitle: 'Check Your Eligibility',
  timelineTitle: 'Step-by-Step Timeline',
  tryItTitle: 'Try It Yourself',
  quizTitle: 'Knowledge Check',
  completed: '✅ Completed',

  // Quiz
  submitAnswers: 'Submit Answers',
  perfectScore: '🎉 Perfect score! Badge unlocked!',
  tryAgain: 'Some answers were incorrect. Try again!',
  retryQuiz: 'Retry Quiz',
  quizCompleted: "You've already completed this quiz and earned your badge!",

  // EVM Simulator
  evmTitle: 'Interactive EVM Simulator',
  evmSubtitle: 'Experience how Electronic Voting Machines work in Indian elections',
  evmReady: '🗳️ EVM is ready',
  evmReadySub: 'Press the button below to begin voting',
  startVoting: 'Start Voting',
  ballotingUnit: 'Balloting Unit — Press the button next to your choice',
  selectCandidate: 'Select a candidate first',
  confirmVote: 'Confirm & Cast Vote',
  voteRecorded: 'Vote Recorded Successfully',
  vvpatSlip: 'VVPAT Slip',
  slipVisible: 'Slip visible for',
  voteCast: 'Your Vote Has Been Cast!',
  voteCastSub: 'The VVPAT slip has dropped into the sealed box. Thank you for participating in democracy!',
  tryAgainEvm: 'Try Again',
  candidateA: 'Candidate A',
  candidateB: 'Candidate B',
  candidateC: 'Candidate C',
  nota: 'NOTA',
  partyA: 'National Progress Party',
  partyB: 'Democratic Alliance',
  partyC: "People's Front",
  partyNota: 'None of the Above',

  // Election Stats
  statsTitle: "India's Election — By The Numbers",
  statsSubtitle: 'The largest democratic exercise in the world',
  statRegistered: 'Registered Voters',
  statPolling: 'Polling Stations',
  statEvm: 'EVMs Used',
  statSeats: 'Lok Sabha Seats',
  statParties: 'Political Parties',
  statDays: 'Days to Count',

  // Eligibility Checker
  eligibilityTitle: 'Am I Eligible to Vote?',
  eligibilitySub: 'Check your eligibility to vote in Indian elections',
  dob: 'Date of Birth',
  citizenQuestion: 'Are you an Indian citizen?',
  yes: 'Yes',
  no: 'No',
  checkEligibility: 'Check Eligibility',
  eligibleMsg: (age) => `✅ Congratulations! You are eligible to vote. You are ${age} years old and meet all requirements.`,
  eligibleTip: "If you haven't registered yet, visit nvsp.in or your nearest ERO office to fill Form 6.",
  notCitizenMsg: '❌ Only Indian citizens are eligible to vote in Indian elections.',
  notCitizenTip: 'If you are a Non-Resident Indian (NRI) with Indian citizenship, you can still register as an overseas voter.',
  tooYoungMsg: (age) => `❌ You are currently ${age} years old. The minimum voting age in India is 18 years.`,
  tooYoungTip: 'You will be eligible to vote once you turn 18 on or before 1st January of the election year.',

  // Certificate
  certLocked: 'Certificate Locked',
  certLockedMsg: (total) => `Complete all ${total} modules and pass their quizzes to unlock your Certificate of Completion.`,
  certModulesCompleted: (done, total) => `${done} of ${total} modules completed`,
  certReady: (name) => `Congratulations, ${name}!`,
  certReadyMsg: 'You have completed all modules! Download your certificate below.',
  downloadCert: '📥 Download Certificate',
  certLanguageLabel: 'Certificate language:',
  certEnglish: 'English',
  certHindi: 'हिन्दी',
  certTitle: 'Certificate of Completion',
  certProgram: 'Election Process Education Assistant',
  certCertifies: 'This is to certify that',
  certBody1: 'has successfully completed all modules of the',
  certBody2: 'Election Process Education program and demonstrated',
  certBody3: 'knowledge of Indian democratic processes.',
  certBadges: 'Badges Earned: 📝 ⚖️ 📢 🗳️ 🏆',
  certDate: 'Date',
  certFooter: 'Election Process Education • Prompt Wars Hackathon 2026',

  // Chat
  chatTitle: '🤖 AI Election Tutor',
  chatPlaceholder: 'Ask about elections...',
  chatGreeting: (module) => `Hi! I'm your Election Education AI assistant. You're currently in the "${module}" module. Ask me anything about elections!`,
  chatError: 'Unable to reach the AI server. Make sure the backend is running.',
  chatFallback: 'Sorry, I could not generate a response.',

  // Badge
  badgeLocked: 'Locked',
};

export default en;
