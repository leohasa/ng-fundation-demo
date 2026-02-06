import { Pipe, PipeTransform, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { effect } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Required for dynamic updates
})
export class TranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Watch for translation changes and language changes
    const effectRef = effect(() => {
      // This will re-run when translations are loaded or language changes
      this.translationService.translationsLoaded();
      this.translationService.currentLanguage();
      this.cdr.markForCheck();
    });
    
    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      effectRef.destroy();
    });
  }

  transform(key: string, params?: Record<string, string | number>): string {
    if (!key) return '';
    return this.translationService.translate(key, params);
  }
}
