import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';
import { AVAILABLE_LANGUAGES } from '../../core/models/language.model';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <button
        type="button"
        (click)="toggleDropdown()"
        class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-md hover:bg-gray-50 transition-colors"
        [class.bg-gray-50]="isOpen()"
      >
        <span class="text-lg">{{ currentLanguageInfo().flag }}</span>
        <span class="hidden sm:inline">{{ currentLanguageInfo().nativeName }}</span>
        <svg 
          class="w-4 h-4 transition-transform"
          [class.rotate-180]="isOpen()"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      @if (isOpen()) {
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div class="py-1" role="menu">
            @for (language of availableLanguages; track language.code) {
              <button
                type="button"
                (click)="selectLanguage(language.code)"
                class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                [class.bg-blue-50]="language.code === currentLanguage()"
                [class.text-blue-600]="language.code === currentLanguage()"
                [class.font-semibold]="language.code === currentLanguage()"
                role="menuitem"
              >
                <span class="text-lg">{{ language.flag }}</span>
                <span class="flex-1 text-left">{{ language.nativeName }}</span>
                @if (language.code === currentLanguage()) {
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LanguageSelectorComponent {
  private readonly translationService = inject(TranslationService);
  
  isOpen = signal(false);
  currentLanguage = this.translationService.currentLanguage;
  currentLanguageInfo = this.translationService.currentLanguageInfo;
  availableLanguages = AVAILABLE_LANGUAGES;

  toggleDropdown(): void {
    this.isOpen.update(value => !value);
  }

  selectLanguage(code: string): void {
    this.translationService.setLanguage(code as any);
    this.isOpen.set(false);
  }
}
