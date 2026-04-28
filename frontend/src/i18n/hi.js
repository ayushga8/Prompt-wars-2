const hi = {
  // Language meta
  langName: 'हिन्दी',
  langCode: 'hi',

  // App / Navbar
  appTitle: 'चुनाव सहायक',
  signOut: 'साइन आउट',
  loading: 'लोड हो रहा है...',

  // Auth
  authTitle: 'चुनाव प्रक्रिया शिक्षा',
  authSubtitle: 'चुनाव प्रक्रिया, समयसीमा और चरणों को इंटरैक्टिव और आसान तरीके से समझें।',
  signIn: 'साइन इन करें',
  signInGoogle: 'Google से साइन इन करें',
  or: 'या',
  firstName: 'पहला नाम',
  lastName: 'उपनाम',
  emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
  sendOtp: 'ईमेल द्वारा OTP भेजें',
  sending: 'भेजा जा रहा है...',
  otpSentTo: 'OTP भेजा गया है:',
  enterOtp: '6 अंकों का OTP दर्ज करें',
  verifyOtp: 'OTP सत्यापित करें',
  verifying: 'सत्यापित हो रहा है...',
  back: '← वापस',
  errorName: 'कृपया अपना पहला और अंतिम नाम दर्ज करें।',
  errorEmail: 'कृपया एक मान्य ईमेल पता दर्ज करें।',
  errorOtp: 'कृपया 6 अंकों का OTP दर्ज करें।',
  errorServer: 'सर्वर तक पहुँचने में असमर्थ। कृपया बाद में पुनः प्रयास करें।',
  errorOtpFailed: 'OTP भेजने में विफल।',
  errorOtpInvalid: 'अमान्य OTP।',

  // Sidebar
  learningModules: 'शिक्षण मॉड्यूल',
  progress: 'प्रगति',

  // ModuleContent
  welcomeTitle: 'चुनाव प्रक्रिया एक्सप्लोरर में आपका स्वागत है!',
  checkEligibilityTitle: 'अपनी पात्रता जाँचें',
  timelineTitle: 'चरण-दर-चरण समयरेखा',
  tryItTitle: 'स्वयं आज़माएँ',
  quizTitle: 'ज्ञान परीक्षण',
  completed: '✅ पूर्ण',

  // Quiz
  submitAnswers: 'उत्तर जमा करें',
  perfectScore: '🎉 शानदार! बैज अनलॉक हो गया!',
  tryAgain: 'कुछ उत्तर गलत थे। पुनः प्रयास करें!',
  retryQuiz: 'पुनः प्रयास करें',
  quizCompleted: 'आपने यह क्विज़ पहले ही पूरा कर लिया है और अपना बैज अर्जित कर लिया है!',

  // EVM Simulator
  evmTitle: 'इंटरैक्टिव EVM सिम्युलेटर',
  evmSubtitle: 'अनुभव करें कि भारतीय चुनावों में इलेक्ट्रॉनिक वोटिंग मशीन कैसे काम करती है',
  evmReady: '🗳️ EVM तैयार है',
  evmReadySub: 'मतदान शुरू करने के लिए नीचे दिए गए बटन को दबाएँ',
  startVoting: 'मतदान शुरू करें',
  ballotingUnit: 'मतपत्र इकाई — अपनी पसंद के बगल में बटन दबाएँ',
  selectCandidate: 'पहले एक उम्मीदवार चुनें',
  confirmVote: 'पुष्टि करें और वोट डालें',
  voteRecorded: 'वोट सफलतापूर्वक दर्ज हुआ',
  vvpatSlip: 'VVPAT पर्ची',
  slipVisible: 'पर्ची दिखाई दे रही है:',
  voteCast: 'आपका वोट डाला जा चुका है!',
  voteCastSub: 'VVPAT पर्ची सीलबंद बॉक्स में गिर गई है। लोकतंत्र में भाग लेने के लिए धन्यवाद!',
  tryAgainEvm: 'पुनः प्रयास करें',
  candidateA: 'उम्मीदवार A',
  candidateB: 'उम्मीदवार B',
  candidateC: 'उम्मीदवार C',
  nota: 'नोटा',
  partyA: 'राष्ट्रीय प्रगति पार्टी',
  partyB: 'लोकतांत्रिक गठबंधन',
  partyC: 'जनता मोर्चा',
  partyNota: 'इनमें से कोई नहीं',

  // Election Stats
  statsTitle: 'भारत का चुनाव — संख्याओं में',
  statsSubtitle: 'विश्व का सबसे बड़ा लोकतांत्रिक अभ्यास',
  statRegistered: 'पंजीकृत मतदाता',
  statPolling: 'मतदान केंद्र',
  statEvm: 'उपयोग की गई EVM',
  statSeats: 'लोकसभा सीटें',
  statParties: 'राजनीतिक दल',
  statDays: 'गणना के दिन',

  // Eligibility Checker
  eligibilityTitle: 'क्या मैं मतदान के योग्य हूँ?',
  eligibilitySub: 'भारतीय चुनावों में मतदान के लिए अपनी पात्रता जाँचें',
  dob: 'जन्म तिथि',
  citizenQuestion: 'क्या आप भारतीय नागरिक हैं?',
  yes: 'हाँ',
  no: 'नहीं',
  checkEligibility: 'पात्रता जाँचें',
  eligibleMsg: (age) => `✅ बधाई! आप मतदान के योग्य हैं। आपकी आयु ${age} वर्ष है और आप सभी आवश्यकताओं को पूरा करते हैं।`,
  eligibleTip: 'यदि आपने अभी तक पंजीकरण नहीं कराया है, तो फॉर्म 6 भरने के लिए nvsp.in या अपने नज़दीकी ERO कार्यालय पर जाएँ।',
  notCitizenMsg: '❌ केवल भारतीय नागरिक ही भारतीय चुनावों में मतदान कर सकते हैं।',
  notCitizenTip: 'यदि आप भारतीय नागरिकता वाले अनिवासी भारतीय (NRI) हैं, तो आप विदेशी मतदाता के रूप में पंजीकरण करा सकते हैं।',
  tooYoungMsg: (age) => `❌ आपकी वर्तमान आयु ${age} वर्ष है। भारत में न्यूनतम मतदान आयु 18 वर्ष है।`,
  tooYoungTip: 'चुनाव वर्ष की 1 जनवरी को या उससे पहले 18 वर्ष पूरे होने पर आप मतदान के योग्य होंगे।',

  // Certificate
  certLocked: 'प्रमाणपत्र लॉक है',
  certLockedMsg: (total) => `अपना पूर्णता प्रमाणपत्र अनलॉक करने के लिए सभी ${total} मॉड्यूल पूरे करें और उनकी क्विज़ पास करें।`,
  certModulesCompleted: (done, total) => `${total} में से ${done} मॉड्यूल पूर्ण`,
  certReady: (name) => `बधाई, ${name}!`,
  certReadyMsg: 'आपने सभी मॉड्यूल पूरे कर लिए हैं! नीचे अपना प्रमाणपत्र डाउनलोड करें।',
  downloadCert: '📥 प्रमाणपत्र डाउनलोड करें',
  certLanguageLabel: 'प्रमाणपत्र की भाषा:',
  certEnglish: 'English',
  certHindi: 'हिन्दी',
  certTitle: 'पूर्णता प्रमाणपत्र',
  certProgram: 'चुनाव प्रक्रिया शिक्षा सहायक',
  certCertifies: 'यह प्रमाणित किया जाता है कि',
  certBody1: 'ने चुनाव प्रक्रिया शिक्षा कार्यक्रम के',
  certBody2: 'सभी मॉड्यूल सफलतापूर्वक पूरे किए हैं और',
  certBody3: 'भारतीय लोकतांत्रिक प्रक्रियाओं का ज्ञान प्रदर्शित किया है।',
  certBadges: 'अर्जित बैज: 📝 ⚖️ 📢 🗳️ 🏆',
  certDate: 'दिनांक',
  certFooter: 'चुनाव प्रक्रिया शिक्षा • प्रॉम्प्ट वॉर्स हैकथॉन 2026',

  // Chat
  chatTitle: '🤖 AI चुनाव ट्यूटर',
  chatPlaceholder: 'चुनाव के बारे में पूछें...',
  chatGreeting: (module) => `नमस्ते! मैं आपका चुनाव शिक्षा AI सहायक हूँ। आप वर्तमान में "${module}" मॉड्यूल में हैं। चुनाव के बारे में कुछ भी पूछें!`,
  chatError: 'AI सर्वर तक पहुँचने में असमर्थ। सुनिश्चित करें कि बैकएंड चल रहा है।',
  chatFallback: 'क्षमा करें, मैं उत्तर उत्पन्न नहीं कर सका।',

  // Badge
  badgeLocked: 'लॉक',
};

export default hi;
