import { useLanguage } from '../i18n/LanguageContext';

export default function BadgeBar({ badges, totalModules }) {
  const { t } = useLanguage();
  return (
    <div className="badge-bar">
      {badges.map((b, i) => (
        <div key={i} className="badge earned" data-tooltip={b.label}>
          {b.icon}
        </div>
      ))}
      {Array.from({ length: totalModules - badges.length }).map((_, i) => (
        <div key={`locked-${i}`} className="badge locked" data-tooltip={t('badgeLocked')}>
          🔒
        </div>
      ))}
    </div>
  );
}
