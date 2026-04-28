import modulesEn from './modules_en';
import modulesHi from '../i18n/modules_hi';
import modulesTa from '../i18n/modules_ta';

const modulesMap = { en: modulesEn, hi: modulesHi, ta: modulesTa };

export function getModules(lang = 'en') {
  return modulesMap[lang] || modulesEn;
}

// Default export for backward compat (English)
export default modulesEn;
