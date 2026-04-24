export default function BadgeBar({ badges, totalModules }) {
  return (
    <div className="badge-bar">
      {badges.map((b, i) => (
        <div key={i} className="badge earned" data-tooltip={b.label}>
          {b.icon}
        </div>
      ))}
      {Array.from({ length: totalModules - badges.length }).map((_, i) => (
        <div key={`locked-${i}`} className="badge locked" data-tooltip="Locked">
          🔒
        </div>
      ))}
    </div>
  );
}
