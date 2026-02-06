import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LanguageCode, AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE } from '../models/language.model';
import { StorageService } from './storage.service';
import { APP_STORAGE_KEYS } from '../constants/storage.constants';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly storage = inject(StorageService);
  private readonly http = inject(HttpClient);
  
  // Current language signal
  private _currentLanguage = signal<LanguageCode>(this.getInitialLanguage());
  
  // Public read-only signal
  currentLanguage = this._currentLanguage.asReadonly();
  
  // Computed signal for current language info
  currentLanguageInfo = computed(() => {
    const code = this._currentLanguage();
    return AVAILABLE_LANGUAGES.find(lang => lang.code === code) || AVAILABLE_LANGUAGES[0];
  });
  
  // All available languages
  availableLanguages = AVAILABLE_LANGUAGES;
  
  // Translations storage
  private translations = signal<Record<LanguageCode, any>>({
    en: {},
    es: {},
    pt: {}
  });
  
  // Loading state
  private _translationsLoaded = signal<boolean>(false);
  translationsLoaded = this._translationsLoaded.asReadonly();

  constructor() {
    // Load translations for all languages
    this.loadTranslations();
  }

  /**
   * Get initial language from storage or browser
   */
  private getInitialLanguage(): LanguageCode {
    // Try to get from storage first
    const stored = this.storage.get<LanguageCode>(APP_STORAGE_KEYS.LANGUAGE);
    if (stored && this.isValidLanguageCode(stored)) {
      return stored;
    }
    
    // Try to get from browser language
    const browserLang = navigator.language.split('-')[0] as LanguageCode;
    if (this.isValidLanguageCode(browserLang)) {
      return browserLang;
    }
    
    // Fallback to default
    return DEFAULT_LANGUAGE;
  }

  /**
   * Check if language code is valid
   */
  private isValidLanguageCode(code: string): code is LanguageCode {
    return ['en', 'es', 'pt'].includes(code);
  }

  /**
   * Load all translation files
   */
  private async loadTranslations(): Promise<void> {
    try {
      const [en, es, pt] = await Promise.all([
        firstValueFrom(this.http.get('/assets/i18n/en.json')),
        firstValueFrom(this.http.get('/assets/i18n/es.json')),
        firstValueFrom(this.http.get('/assets/i18n/pt.json'))
      ]);
      
      this.translations.set({
        en: en as any,
        es: es as any,
        pt: pt as any
      });
      
      this._translationsLoaded.set(true);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  /**
   * Change current language
   */
  setLanguage(code: LanguageCode): void {
    if (this.isValidLanguageCode(code)) {
      this._currentLanguage.set(code);
      this.storage.set(APP_STORAGE_KEYS.LANGUAGE, code);
    }
  }

  /**
   * Get translation for a key
   */
  translate(key: string, params?: Record<string, string | number>): string {
    const lang = this._currentLanguage();
    const translations = this.translations();
    const isLoaded = this._translationsLoaded();
    
    // Navigate through nested keys (e.g., 'home.title')
    const keys = key.split('.');
    let value: any = translations[lang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    // If translation not found, return the key
    if (value === undefined || value === null) {
      // Only warn if translations are loaded (to avoid noise during initial load)
      if (isLoaded) {
        console.warn(`Translation not found for key: ${key} in language: ${lang}`);
      }
      return key;
    }
    
    // Replace parameters if provided
    let result = String(value);
    if (params) {
      Object.keys(params).forEach(param => {
        result = result.replace(new RegExp(`{{${param}}}`, 'g'), String(params[param]));
      });
    }
    
    return result;
  }

  /**
   * Get instant translation (for use in templates)
   * Returns a computed signal that updates when language changes
   */
  instant(key: string, params?: Record<string, string | number>) {
    return computed(() => this.translate(key, params));
  }
}
