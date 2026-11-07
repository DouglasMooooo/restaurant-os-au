export type Language = 'zh' | 'en';

const KEY = 'restaurantos-demo-language';
const EVENT = 'restaurantos-language-change';

export function readLanguage(): Language {
  try {
    return window.localStorage.getItem(KEY) === 'en' ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

export function writeLanguage(language: Language) {
  try {
    window.localStorage.setItem(KEY, language);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Keep the selected language for the current page even when storage is unavailable.
  }
}

export function subscribeToLanguageChange(callback: () => void) {
  const sync = () => callback();
  window.addEventListener(EVENT, sync);
  window.addEventListener('storage', sync);
  return () => {
    window.removeEventListener(EVENT, sync);
    window.removeEventListener('storage', sync);
  };
}
