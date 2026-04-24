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

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState('overview');
  const [completedModules, setCompletedModules] = useState(new Set());
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);

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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Load user progress from Firestore
        const docRef = doc(db, 'users', u.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCompletedModules(new Set(data.completedModules || []));
          setEarnedBadges(data.earnedBadges || []);
        } else {
          // First-time Google login — send welcome email
          sendWelcomeEmail(u.email, u.displayName || u.email.split('@')[0]);
          await setDoc(docRef, { completedModules: [], earnedBadges: [], joinedAt: new Date().toISOString() });
        }
      } else {
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
    setCompletedModules(new Set());
    setEarnedBadges([]);
    setActiveModuleId('overview');
  };

  // Handle OTP-authenticated users (no Firebase user object)
  const handleOtpLogin = async (displayName, email) => {
    const otpUser = { displayName, email: email || displayName, isOtp: true };
    setUser(otpUser);
    
    // Load user progress from Firestore for OTP users
    const docRef = doc(db, 'users', otpUser.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setCompletedModules(new Set(data.completedModules || []));
      setEarnedBadges(data.earnedBadges || []);
    } else {
      // First-time OTP login — send welcome email
      sendWelcomeEmail(otpUser.email, displayName);
      await setDoc(docRef, { completedModules: [], earnedBadges: [], joinedAt: new Date().toISOString() });
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
    return <AuthView onOtpLogin={handleOtpLogin} />;
  }

  const activeModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const progress = Math.round((completedModules.size / (modules.length - 1)) * 100); // exclude overview

  return (
    <div className="app-container">
      <nav className="navbar glass">
        <div className="nav-brand">
          <span className="icon">🏛️</span>
          <span className="gradient-text nav-title">Election Assistant</span>
        </div>
        <div className="user-profile">
          <BadgeBar badges={earnedBadges} totalModules={modules.length - 1} />
          <span className="user-name">{user.displayName || user.email}</span>
          <button className="btn outline-btn small" onClick={handleSignOut}>Sign Out</button>
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

        <main className="content-area glass">
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
