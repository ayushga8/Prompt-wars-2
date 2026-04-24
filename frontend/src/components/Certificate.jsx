import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export default function Certificate({ userName, badgeCount, totalModules }) {
  const allComplete = badgeCount >= totalModules;

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1000, 700);
    grad.addColorStop(0, '#0b1120');
    grad.addColorStop(1, '#1a1a3e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 700);

    // Border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 940, 640);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 920, 620);

    // Title
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 42px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', 500, 120);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText('Election Process Education Assistant', 500, 160);

    // Decorative line
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 185);
    ctx.lineTo(700, 185);
    ctx.stroke();

    // "This certifies that"
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('This is to certify that', 500, 240);

    // Name
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.fillText(userName || 'Student', 500, 300);

    // Body
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText('has successfully completed all modules of the', 500, 360);
    ctx.fillText('Election Process Education program and demonstrated', 500, 390);
    ctx.fillText('knowledge of Indian democratic processes.', 500, 420);

    // Badges
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '16px Inter, sans-serif';
    ctx.fillText('Badges Earned: 📝 ⚖️ 📢 🗳️ 🏆', 500, 480);

    // Date
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 500, 540);

    // ECI reference
    ctx.fillStyle = '#475569';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Election Process Education • Prompt Wars Hackathon 2026', 500, 620);

    // Download as PDF
    const imgData = canvas.toDataURL('image/png');
    // jsPDF uses landscape orientation, unit is pt, format matches canvas aspect ratio loosely or use A4
    // We'll create a PDF matching the exact canvas dimensions (1000x700px -> roughly 750x525pt)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [1000, 700]
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 1000, 700);
    pdf.save('election-education-certificate.pdf');

    confetti({ particleCount: 200, spread: 120, origin: { y: 0.3 }, zIndex: 1000 });
  };

  if (!allComplete) {
    return (
      <div className="certificate-locked">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
        <h3>Certificate Locked</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Complete all {totalModules} modules and pass their quizzes to unlock your Certificate of Completion.
        </p>
        <div className="cert-progress">
          <div className="cert-progress-bar" style={{ width: `${(badgeCount / totalModules) * 100}%` }}></div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{badgeCount} of {totalModules} modules completed</p>
      </div>
    );
  }

  return (
    <div className="certificate-ready fade-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
      <h3 className="gradient-text" style={{ fontSize: '1.5rem' }}>Congratulations, {userName}!</h3>
      <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
        You have completed all modules! Download your certificate below.
      </p>
      <button className="btn success-btn" style={{ maxWidth: '300px', margin: '0 auto' }} onClick={handleDownload}>
        📥 Download Certificate
      </button>
    </div>
  );
}
