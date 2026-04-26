import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthView from './components/AuthView';
import Sidebar from './components/Sidebar';
import ModuleContent from './components/ModuleContent';
import ChatPanel from './components/ChatPanel';
import BadgeBar from './components/BadgeBar';
import modules from './data/modules';

// Restore cached user from localStorage for instant rendering on refresh
function getCachedUser() {
  try {
    const cached = localStorage.getItem('cachedUser');
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
}

function cacheUser(u) {
  try {
    if (u) {
      localStorage.setItem('cachedUser', JSON.stringify({
        displayName: u.displayName || '',
        email: u.email,
        isOtp: u.isOtp || false,
      }));
    } else {
      localStorage.removeItem('cachedUser');
    }
  } catch { /* localStorage not available */ }
}

function getCachedProgress() {
  try {
    const cached = localStorage.getItem('cachedProgress');
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
}

function cacheProgress(completedModules, earnedBadges) {
  try {
    localStorage.setItem('cachedProgress', JSON.stringify({
      completedModules: Array.from(completedModules),
      earnedBadges,
    }));
  } catch { /* localStorage not available */ }
}

export default function App() {
  const cachedUser = getCachedUser();
  const cachedProgress = getCachedProgress();

  const [user, setUser] = useState(cachedUser);
  const [loading, setLoading] = useState(!cachedUser); // Skip loading if we have a cached user
  const [activeModuleId, setActiveModuleId] = useState('overview');
  const [completedModules, setCompletedModules] = useState(
    cachedProgress ? new Set(cachedProgress.completedModules) : new Set()
  );
  const [earnedBadges, setEarnedBadges] = useState(
    cachedProgress ? cachedProgress.earnedBadges : []
  );
  const [chatOpen, setChatOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  // Send welcome email on first login only
  const sendWelcomeEmail = async (email, name) => {
    try {
      await fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
    } catch (err) {
      console.warn('Welcome email failed (non-critical):', err);
    }
  };

  // Load user progress from Firestore (non-blocking, runs in background)
  const loadUserProgress = async (u) => {
    try {
      const docRef = doc(db, 'users', u.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const modules = new Set(data.completedModules || []);
        const badges = data.earnedBadges || [];
        setCompletedModules(modules);
        setEarnedBadges(badges);
        cacheProgress(modules, badges);
      } else {
        // First-time login — send welcome email
        sendWelcomeEmail(u.email, u.displayName || u.email.split('@')[0]);
        await setDoc(docRef, { completedModules: [], earnedBadges: [], joinedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Failed to load user data from Firestore:', err);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        cacheUser(u);
        loadUserProgress(u);
      } else {
        setUser(null);
        cacheUser(null);
        localStorage.removeItem('cachedProgress');
        setCompletedModules(new Set());
        setEarnedBadges([]);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleModuleComplete = async (moduleId) => {
    if (completedModules.has(moduleId)) return;
    
    const newCompleted = new Set(completedModules);
    newCompleted.add(moduleId);
    setCompletedModules(newCompleted);

    let newBadges = [...earnedBadges];
    const mod = modules.find(m => m.id === moduleId);
    if (mod && mod.badgeIcon) {
      newBadges = [...newBadges, { icon: mod.badgeIcon, label: mod.badgeLabel }];
      setEarnedBadges(newBadges);
    }

    // Cache progress locally
    cacheProgress(newCompleted, newBadges);

    // Save to Firestore
    if (user && user.email) {
      const docRef = doc(db, 'users', user.email);
      await setDoc(docRef, {
        completedModules: Array.from(newCompleted),
        earnedBadges: newBadges
      }, { merge: true });
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    cacheUser(null);
    localStorage.removeItem('cachedProgress');
    setCompletedModules(new Set());
    setEarnedBadges([]);
    setActiveModuleId('overview');
  };

  // Handle OTP-authenticated users (no Firebase user object)
  const handleOtpLogin = async (displayName, email) => {
    const otpUser = { displayName, email: email || displayName, isOtp: true };
    setUser(otpUser);
    cacheUser(otpUser);
    
    try {
      const docRef = doc(db, 'users', otpUser.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const modules = new Set(data.completedModules || []);
        const badges = data.earnedBadges || [];
        setCompletedModules(modules);
        setEarnedBadges(badges);
        cacheProgress(modules, badges);
      } else {
        sendWelcomeEmail(otpUser.email, displayName);
        await setDoc(docRef, { completedModules: [], earnedBadges: [], joinedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Failed to load OTP user data from Firestore:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100 }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <AuthView onOtpLogin={handleOtpLogin} />
      </>
    );
  }

  const activeModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const progress = Math.round((completedModules.size / (modules.length - 1)) * 100); // exclude overview

  return (
    <div className="app-container">
      <nav className="navbar glass" aria-label="Main navigation">
        <div className="nav-brand">
          <span className="icon" aria-hidden="true">🏛️</span>
          <span className="gradient-text nav-title">Election Assistant</span>
        </div>
        <div className="user-profile">
          <BadgeBar badges={earnedBadges} totalModules={modules.length - 1} />
          <button className="theme-toggle" onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="user-name">{user.displayName || user.email}</span>
          <button className="btn outline-btn small" onClick={handleSignOut} aria-label="Sign out of your account">Sign Out</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <Sidebar
          modules={modules}
          activeModuleId={activeModuleId}
          completedModules={completedModules}
          onSelect={setActiveModuleId}
          progress={progress}
        />

        <main className="content-area glass" aria-label={`Module: ${activeModule.title}`}>
          <ModuleContent
            module={activeModule}
            isCompleted={completedModules.has(activeModule.id)}
            onComplete={handleModuleComplete}
            userName={user.displayName || user.email.split('@')[0]}
            badgeCount={earnedBadges.length}
            totalModules={modules.length - 1}
          />
        </main>
      </div>

      <button
        className="chat-toggle-btn"
        onClick={() => setChatOpen(!chatOpen)}
        title="Ask AI about elections"
        aria-label={chatOpen ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={chatOpen}
      >
        {chatOpen ? '✕' : '💬'}
      </button>

      {chatOpen && (
        <ChatPanel
          moduleContext={activeModule.title}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
