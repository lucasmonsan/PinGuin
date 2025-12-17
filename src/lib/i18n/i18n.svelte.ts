import { browser } from '$app/environment';
import type { Locale, I18nDictionary } from './types';
import { ptBR } from './locales/pt-BR';
import { enUS } from './locales/en-US';

const locales: Record<Locale, I18nDictionary> = {
  'pt-BR': ptBR,
  'en-US': enUS
};

function detectLanguage(): Locale {
  if (!browser) return 'pt-BR';
  
  // 1. Verificar localStorage (preferência do usuário)
  const saved = localStorage.getItem('locale') as Locale;
  if (saved && locales[saved]) return saved;
  
  // 2. Detectar do navegador
  const browserLang = navigator.language || navigator.languages?.[0] || 'pt-BR';
  
  // 3. Mapear códigos
  if (browserLang.startsWith('pt')) return 'pt-BR';
  if (browserLang.startsWith('en')) return 'en-US';
  
  // 4. Fallback
  return 'pt-BR';
}

class I18n {
  private currentLocale: Locale = $state('pt-BR');
  private initialized = false;

  init() {
    if (!this.initialized && browser) {
      this.initialized = true;
      this.currentLocale = detectLanguage();
      this.updateHtmlLang();
    }
  }

  private ensureInitialized() {
    if (!this.initialized && browser) {
      this.init();
    }
  }

  get locale(): Locale {
    this.ensureInitialized();
    return this.currentLocale;
  }

  setLocale(locale: Locale) {
    this.ensureInitialized();
    this.currentLocale = locale;
    if (browser) {
      localStorage.setItem('locale', locale);
      this.updateHtmlLang();
    }
  }

  private updateHtmlLang() {
    if (browser && typeof document !== 'undefined') {
      document.documentElement.lang = this.currentLocale;
    }
  }

  get t(): I18nDictionary {
    this.ensureInitialized();
    return locales[this.currentLocale] || locales['pt-BR'] || ptBR;
  }
}

export const i18n = new I18n();
export type { Locale, I18nDictionary };