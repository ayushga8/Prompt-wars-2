import { useState, useEffect, useCallback, useMemo } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useLanguage } from './i18n/LanguageContext';
import { getModules } from './data/modules';
import AuthView from './components/AuthView';
import Sidebar from './components/Sidebar';
import ModuleContent from './components/ModuleContent';
import ChatPanel from './components/ChatPanel';
import BadgeBar from './components/BadgeBar';
import LanguageSwitcher from './components/LanguageSwitcher';

/**
 * Retrieves the cached user object from localStorage for instant rendering on refresh.
 * Prevents a flash of the login screen while Firebase Auth initializes.
 *
 * @returns {Object|null} Cached user object with displayName, email, and isOtp fields, or null
 */
function getCachedUser() {
  try {
    const cached = localStorage.getItem('cachedUser');
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
}

/**
 * Persists or clears the user object in localStorage for session restoration.
 *
 * @param {Object|null} u - User object to cache, or null to clear
 * @param {string} [u.displayName] - User's display name
 * @param {string} u.email - User's email address
 * @param {boolean} [u.isOtp] - Whether the user authenticated via OTP
 */
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

/**
 * Retrieves cached learning progress from localStorage.
 *
 * @returns {Object|null} Object with completedModules array and earnedBadges array, or null
 */
function getCachedProgress() {
  try {
    const cached = localStorage.getItem('cachedProgress');
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
}

/**
 * Persists learning progress to localStorage for offline resilience.
 *
 * @param {Set<string>} completedModules - Set of completed module IDs
 * @param {Array<{icon: string, label: string}>} earnedBadges - Array of earned badge objects
 */
function cacheProgress(completedModules, earnedBadges) {
  try {
    localStorage.setItem('cachedProgress', JSON.stringify({
      completedModules: Array.from(completedModules),
      earnedBadges,
    }));
  } catch { /* localStorage not available */ }
}

/**
 * Root application component managing authentication state, learning progress,
 * module navigation, and theme toggling. Orchestrates the main layout including
 * navigation bar, sidebar, content area, and AI chat panel.
 *
 * @returns {JSX.Element} The complete application UI
 */
export default function App() {
  const { lang, t } = useLanguage();
  const modules = useMemo(() => getModules(lang), [lang]);

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

  const toggleTheme = useCallback(
    () => setTheme(prev => prev === 'dark' ? 'light' : 'dark'),
    []
  );

  /**
   * Sends a welcome email to new users on their first login.
   * Non-critical — failures are silently logged.
   *
   * @param {string} email - User's email address
   * @param {string} name - User's display name
   */
  const sendWelcomeEmail = useCallback(async (email, name) => {
    try {
      await fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
    } catch (err) {
      console.warn('Welcome email failed (non-critical):', err);
    }
  }, []);

  /**
   * Loads user progress from Firestore in the background.
   * Creates an initial document with a welcome email for first-time users.
   *
   * @param {Object} u - The authenticated user object
   */
  const loadUserProgress = useCallback(async (u) => {
    try {
      const docRef = doc(db, 'users', u.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const mods = new Set(data.completedModules || []);
        const badges = data.earnedBadges || [];
        setCompletedModules(mods);
        setEarnedBadges(badges);
        cacheProgress(mods, badges);
      } else {
        // First-time login — send welcome email
        sendWelcomeEmail(u.email, u.displayName || u.email.split('@')[0]);
        await setDoc(docRef, { completedModules: [], earnedBadges: [], joinedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Failed to load user data from Firestore:', err);
    }
  }, [sendWelcomeEmail]);

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
  }, [loadUserProgress]);

  /**
   * Marks a module as completed, awards its badge, and persists to Firestore.
   *
   * @param {string} moduleId - The ID of the completed module
   */
  const handleModuleComplete = useCallback(async (moduleId) => {
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

    // Save to Firestore with error handling
    if (user && user.email) {
      try {
        const docRef = doc(db, 'users', user.email);
        await setDoc(docRef, {
          completedModules: Array.from(newCompleted),
          earnedBadges: newBadges
        }, { merge: true });
      } catch (err) {
        console.warn('Failed to save progress to Firestore:', err);
      }
    }
  }, [completedModules, earnedBadges, modules, user]);

  /**
   * Signs out the current user, clears all cached state, and resets to the overview module.
   */
  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    setUser(null);
    cacheUser(null);
    localStorage.removeItem('cachedProgress');
    setCompletedModules(new Set());
    setEarnedBadges([]);
    setActiveModuleId('overview');
  }, []);

  /**
   * Handles login for OTP-authenticated users who don't have a Firebase user object.
   * Creates a synthetic user object and loads their Firestore progress.
   *
   * @param {string} displayName - User's full name
   * @param {string} email - User's email address
   */
  const handleOtpLogin = useCallback(async (displayName, email) => {
    const otpUser = { displayName, email: email || displayName, isOtp: true };
    setUser(otpUser);
    cacheUser(otpUser);
    
    try {
      const docRef = doc(db, 'users', otpUser.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const mods = new Set(data.completedModules || []);
        const badges = data.earnedBadges || [];
        setCompletedModules(mods);
        setEarnedBadges(badges);
        cacheProgress(mods, badges);
      } else {
        sendWelcomeEmail(otpUser.email, displayName);
        await setDoc(docRef, { completedModules: [], earnedBadges: [], joinedAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Failed to load OTP user data from Firestore:', err);
    }
  }, [sendWelcomeEmail]);

  /** Toggle chat panel visibility */
  const toggleChat = useCallback(() => setChatOpen(prev => !prev), []);
  const closeChat = useCallback(() => setChatOpen(false), []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="auth-top-controls">
          <LanguageSwitcher />
          <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100 }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
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
          <span className="gradient-text nav-title">{t('appTitle')}</span>
        </div>
        <div className="user-profile">
          <BadgeBar badges={earnedBadges} totalModules={modules.length - 1} />
          <LanguageSwitcher />
          <button className="theme-toggle" onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="user-name">{user.displayName || user.email}</span>
          <button className="btn outline-btn small" onClick={handleSignOut} aria-label="Sign out of your account">{t('signOut')}</button>
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
        onClick={toggleChat}
        title={t('chatPlaceholder')}
        aria-label={chatOpen ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={chatOpen}
      >
        {chatOpen ? '✕' : '💬'}
      </button>

      {chatOpen && (
        <ChatPanel
          moduleContext={activeModule.title}
          onClose={closeChat}
        />
      )}
    </div>
  );
}
