import './style.css';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// User should replace this with their actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQf-onP58YGl0uSMSLhUptEs13hQVYhYw",
  authDomain: "promptwars-2.firebaseapp.com",
  projectId: "promptwars-2",
  storageBucket: "promptwars-2.firebasestorage.app",
  messagingSenderId: "715657935538",
  appId: "1:715657935538:web:90b1669b25a08db5a567ab",
  measurementId: "G-RDSCN56FXE"
};

// Only initialize if the user has provided real config
let auth;
let googleProvider;
try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  }
} catch (error) {
  console.warn("Firebase not properly configured. Using mock auth for display.");
}

// UI Elements
const authView = document.getElementById('auth-view');
const assistantView = document.getElementById('assistant-view');
const googleBtn = document.getElementById('google-signin-btn');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const backToEmailBtn = document.getElementById('back-to-email-btn');
const emailInput = document.getElementById('email-input');
const firstNameInput = document.getElementById('first-name-input');
const lastNameInput = document.getElementById('last-name-input');
const otpInput = document.getElementById('otp-input');
const emailStep = document.getElementById('email-step');
const otpStep = document.getElementById('otp-step');
const authError = document.getElementById('auth-error');
const signOutBtn = document.getElementById('sign-out-btn');
const userDisplayName = document.getElementById('user-display-name');

// Module Navigation
const navItems = document.querySelectorAll('.nav-list li');
const moduleContent = document.getElementById('module-content');

// Backend URL
const BACKEND_URL = '';
// State
let currentEmail = '';
let earnedBadges = new Set();
let moduleProgress = {
  'module-overview': true,
  'module-registration': false,
  'module-laws': false,
  'module-campaigns': false,
  'module-voting': false,
  'module-results': false
};

// Gamification Logic
const badgeIcons = {
  'module-registration': { icon: '📝', tooltip: 'Registered Voter' },
  'module-laws': { icon: '⚖️', tooltip: 'Legal Scholar' },
  'module-campaigns': { icon: '📢', tooltip: 'Campaign Analyst' },
  'module-voting': { icon: '🗳️', tooltip: 'Civic Duty' },
  'module-results': { icon: '🏆', tooltip: 'Election Expert' }
};

function updateBadges(moduleId) {
  if (!earnedBadges.has(moduleId) && badgeIcons[moduleId]) {
    earnedBadges.add(moduleId);
    const container = document.getElementById('badges-container');
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = badgeIcons[moduleId].icon;
    badge.setAttribute('data-tooltip', badgeIcons[moduleId].tooltip);
    container.appendChild(badge);
    
    // Tiny celebration for earning a badge
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.1, x: 0.8 },
      zIndex: 1000
    });
  }
}

// Content Data with Interactive HTML
const moduleData = {
  'module-overview': `
    <div class="welcome-banner">
      <h2 class="gradient-text">Welcome to the Election Process Explorer!</h2>
      <p>Select a module from the left to start learning about how democracy works. Earn badges as you complete interactive challenges!</p>
    </div>
  `,
  'module-registration': `
    <div class="module-content">
      <h2 class="gradient-text">Voter Registration</h2>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">The first and most crucial step in participating in democracy.</p>
      
      <div class="timeline">
        <div class="timeline-item left">
          <div class="timeline-content">
            <h3>1. Eligibility Check</h3>
            <p>Ensure you meet the age and citizenship requirements.</p>
          </div>
        </div>
        <div class="timeline-item right">
          <div class="timeline-content">
            <h3>2. Gathering Documents</h3>
            <p>Collect valid ID, proof of address, and other necessary documents.</p>
          </div>
        </div>
        <div class="timeline-item left">
          <div class="timeline-content">
            <h3>3. Submission</h3>
            <p>Submit your application online, by mail, or in person before the deadline.</p>
          </div>
        </div>
      </div>
      <div class="action-area">
        <button id="complete-registration-btn" class="btn success-btn" style="width:auto">Complete Registration Module</button>
      </div>
    </div>
  `,
  'module-laws': `
    <div class="module-content">
      <h2 class="gradient-text">Election Laws & Integrity</h2>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Understanding the rules that keep elections fair and secure.</p>
      
      <div class="flip-card-container">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h3>Voter ID Laws</h3>
              <p style="font-size:0.875rem; color:var(--text-secondary); margin-top:1rem;">(Click to flip)</p>
            </div>
            <div class="flip-card-back">
              <p>Regulations requiring voters to show a form of identification to prevent voter impersonation fraud.</p>
            </div>
          </div>
        </div>
        
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h3>Campaign Finance</h3>
              <p style="font-size:0.875rem; color:var(--text-secondary); margin-top:1rem;">(Click to flip)</p>
            </div>
            <div class="flip-card-back">
              <p>Laws that regulate the raising and spending of money in political campaigns to ensure transparency.</p>
            </div>
          </div>
        </div>
        
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h3>Gerrymandering</h3>
              <p style="font-size:0.875rem; color:var(--text-secondary); margin-top:1rem;">(Click to flip)</p>
            </div>
            <div class="flip-card-back">
              <p>The practice of manipulating electoral district boundaries to favor one political party over another.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="action-area">
        <button id="complete-laws-btn" class="btn success-btn" style="width:auto">I Understand The Laws</button>
      </div>
    </div>
  `,
  'module-campaigns': `
    <div class="module-content">
      <h2 class="gradient-text">Campaigns & Debates</h2>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">How candidates communicate their vision. Flip the cards to see different campaign strategies!</p>
      
      <div class="flip-card-container">
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h3>Grassroots Strategy</h3>
            </div>
            <div class="flip-card-back">
              <p>Relying on volunteers to knock on doors, make phone calls, and build support from the ground up.</p>
            </div>
          </div>
        </div>
        <div class="flip-card">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <h3>Media Blitz</h3>
            </div>
            <div class="flip-card-back">
              <p>Spending heavily on TV, radio, and digital advertising to reach a massive audience quickly.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="action-area">
        <button id="complete-campaigns-btn" class="btn success-btn" style="width:auto">Complete Campaigns Module</button>
      </div>
    </div>
  `,
  'module-voting': `
    <div class="module-content">
      <h2 class="gradient-text">Interactive Voting Booth</h2>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">It's Election Day! Experience the voting process by casting your simulated ballot.</p>
      
      <div class="voting-booth">
        <div class="ballot-box">
          <div class="candidate-card" data-candidate="A">
            <h3>Candidate A</h3>
            <p>Focuses on Economic Growth</p>
          </div>
          <div class="candidate-card" data-candidate="B">
            <h3>Candidate B</h3>
            <p>Focuses on Social Equality</p>
          </div>
          <div class="candidate-card" data-candidate="C">
            <h3>Candidate C</h3>
            <p>Focuses on Environmental Protection</p>
          </div>
          <div class="candidate-card" data-candidate="Write-In">
            <h3>Write-In</h3>
            <p>Enter your own candidate</p>
          </div>
        </div>
        <button id="cast-vote-btn" class="btn primary-btn" disabled style="max-width: 300px;">Cast Ballot</button>
      </div>
    </div>
  `,
  'module-results': `
    <div class="module-content">
      <h2 class="gradient-text">Results & Certification Quiz</h2>
      <p style="color: var(--text-secondary);">Test your knowledge on how votes are tallied and verified.</p>
      
      <div class="quiz-container">
        <h3>What happens immediately after the polls close?</h3>
        <div class="quiz-options">
          <div class="quiz-option" data-correct="false">A) The winner is immediately declared based on exit polls.</div>
          <div class="quiz-option" data-correct="true">B) Secure ballot boxes are sealed and tallying begins.</div>
          <div class="quiz-option" data-correct="false">C) Candidates begin their new terms in office.</div>
        </div>
        <p id="quiz-feedback" style="margin-top: 1rem; height: 1.5rem;"></p>
      </div>
    </div>
  `
};

function showError(msg) {
  authError.textContent = msg;
  authError.classList.remove('hidden');
  setTimeout(() => authError.classList.add('hidden'), 5000);
}

function showAssistant(name) {
  userDisplayName.textContent = name;
  authView.classList.remove('active');
  setTimeout(() => {
    authView.classList.add('hidden');
    assistantView.classList.remove('hidden');
    // slight delay for rendering before making active to trigger css transition
    setTimeout(() => assistantView.classList.add('active'), 50);
  }, 500); // Wait for fade out
}

function showAuth() {
  assistantView.classList.remove('active');
  setTimeout(() => {
    assistantView.classList.add('hidden');
    authView.classList.remove('hidden');
    setTimeout(() => authView.classList.add('active'), 50);
  }, 500);
}

// Navigation & Interactive Logic Initialization
function initInteractiveElements(target) {
  // 1. Flip Cards (Laws & Campaigns)
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // 2. Simple Completion Buttons
  const completeBtns = {
    'module-registration': document.getElementById('complete-registration-btn'),
    'module-laws': document.getElementById('complete-laws-btn'),
    'module-campaigns': document.getElementById('complete-campaigns-btn')
  };
  
  if (completeBtns[target]) {
    completeBtns[target].addEventListener('click', () => {
      completeBtns[target].textContent = 'Completed!';
      completeBtns[target].classList.replace('success-btn', 'outline-btn');
      completeBtns[target].disabled = true;
      updateBadges(target);
    });
  }

  // 3. Voting Booth Logic
  if (target === 'module-voting') {
    const candidates = document.querySelectorAll('.candidate-card');
    const castVoteBtn = document.getElementById('cast-vote-btn');
    let selectedCandidate = null;

    candidates.forEach(card => {
      card.addEventListener('click', () => {
        candidates.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedCandidate = card.getAttribute('data-candidate');
        castVoteBtn.disabled = false;
      });
    });

    castVoteBtn.addEventListener('click', () => {
      if (selectedCandidate) {
        castVoteBtn.textContent = 'Vote Cast!';
        castVoteBtn.classList.replace('primary-btn', 'success-btn');
        castVoteBtn.disabled = true;
        candidates.forEach(c => c.style.pointerEvents = 'none');
        
        // Massive confetti for voting
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, zIndex: 1000 });
        updateBadges('module-voting');
      }
    });
  }

  // 4. Quiz Logic (Results Module)
  if (target === 'module-results') {
    const options = document.querySelectorAll('.quiz-option');
    const feedback = document.getElementById('quiz-feedback');
    
    options.forEach(option => {
      option.addEventListener('click', () => {
        // Disable further clicks
        options.forEach(o => o.style.pointerEvents = 'none');
        
        if (option.getAttribute('data-correct') === 'true') {
          option.classList.add('correct');
          feedback.textContent = "✅ Correct! Tallying begins immediately.";
          feedback.style.color = "var(--success)";
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 1000 });
          updateBadges('module-results');
        } else {
          option.classList.add('wrong');
          feedback.textContent = "❌ Incorrect. Try again by reloading the module.";
          feedback.style.color = "var(--error)";
          // Reveal correct answer
          document.querySelector('.quiz-option[data-correct="true"]').classList.add('correct');
        }
      });
    });
  }
}

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    navItems.forEach(nav => nav.classList.remove('active'));
    e.target.classList.add('active');
    
    const target = e.target.getAttribute('data-target');
    
    // Animate content change
    moduleContent.style.opacity = 0;
    setTimeout(() => {
      moduleContent.innerHTML = moduleData[target] || moduleData['module-overview'];
      moduleContent.style.opacity = 1;
      initInteractiveElements(target);
    }, 200);
  });
});

// Firebase Auth Observer
if (auth) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      showAssistant(user.displayName || user.email);
    } else {
      showAuth();
    }
  });
}

// Google Sign-In
googleBtn.addEventListener('click', async () => {
  if (!auth) {
    // Mock for prompt wars if no config provided
    showAssistant("Demo User (Google)");
    return;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    showAssistant(result.user.displayName);
  } catch (error) {
    showError(error.message);
  }
});

// Email OTP Flow
sendOtpBtn.addEventListener('click', async () => {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  currentEmail = emailInput.value.trim();

  if (!firstName || !lastName) {
    return showError("Please enter your first and last name.");
  }
  if (!currentEmail || !currentEmail.includes('@')) {
    return showError("Please enter a valid email address.");
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentEmail })
    });
    
    const data = await response.json();
    if (response.ok) {
      emailStep.classList.add('hidden');
      otpStep.classList.remove('hidden');
    } else {
      showError(data.error || "Failed to send OTP.");
    }
  } catch (err) {
    console.warn("Backend not running or CORS error. Using mock flow.");
    // Mock flow for demo purposes if backend isn't running
    emailStep.classList.add('hidden');
    otpStep.classList.remove('hidden');
    console.log("Mock OTP: 123456");
  }
});

backToEmailBtn.addEventListener('click', () => {
  otpStep.classList.add('hidden');
  emailStep.classList.remove('hidden');
});

verifyOtpBtn.addEventListener('click', async () => {
  const otp = otpInput.value.trim();
  if (otp.length !== 6) {
    return showError("Please enter a 6-digit OTP.");
  }
  
  try {
    const response = await fetch(`${BACKEND_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentEmail, otp })
    });
    
    const data = await response.json();
    const fullName = `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`;
    if (response.ok && data.success) {
      showAssistant(fullName);
    } else {
      showError(data.error || "Invalid OTP.");
    }
  } catch (err) {
    // Mock fallback
    const fullName = `${firstNameInput.value.trim()} ${lastNameInput.value.trim()}`;
    if (otp === "123456") {
      showAssistant(fullName);
    } else {
      showError("Backend not running. Use mock OTP 123456.");
    }
  }
});

signOutBtn.addEventListener('click', async () => {
  if (auth) {
    await signOut(auth);
  } else {
    showAuth();
  }
  // reset OTP state
  otpStep.classList.add('hidden');
  emailStep.classList.remove('hidden');
  firstNameInput.value = '';
  lastNameInput.value = '';
  emailInput.value = '';
  otpInput.value = '';
  
  // reset badges
  earnedBadges.clear();
  document.getElementById('badges-container').innerHTML = '';
});
