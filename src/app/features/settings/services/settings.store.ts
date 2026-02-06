import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Setting, CreateSettingDto, UpdateSettingDto } from '../../../core/models/setting.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsStore {
  private readonly mockData = inject(MockDataService);

  // State
  private readonly _settings = signal<Setting[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Selectors
  readonly settings = this._settings.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly settingsCount = computed(() => this._settings().length);
  readonly hasSettings = computed(() => this._settings().length > 0);

  // Get setting value by key
  readonly getSettingValue = (key: string): string | undefined => {
    return this._settings().find(s => s.key === key)?.value;
  };

  // Get setting by key
  readonly getSettingByKey = (key: string): Setting | undefined => {
    return this._settings().find(s => s.key === key);
  };

  // Actions
  async loadSettings(): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const settings = await firstValueFrom(this.mockData.getSettings$());
      this._settings.set(settings);
    } catch (error) {
      this._error.set('Error al cargar las configuraciones');
      console.error('Error loading settings:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async createSetting(dto: CreateSettingDto): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const newSetting = await firstValueFrom(this.mockData.createSetting$(dto));
      this._settings.update(settings => [...settings, newSetting]);
    } catch (error) {
      this._error.set('Error al crear configuración');
      console.error('Error creating setting:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async updateSetting(dto: UpdateSettingDto): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const updated = await firstValueFrom(this.mockData.updateSetting$(dto));
      this._settings.update(settings => 
        settings.map(setting => setting.id === updated.id ? updated : setting)
      );
    } catch (error) {
      this._error.set('Error al actualizar configuración');
      console.error('Error updating setting:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async deleteSetting(id: string): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      await firstValueFrom(this.mockData.deleteSetting$(id));
      this._settings.update(settings => settings.filter(s => s.id !== id));
    } catch (error) {
      this._error.set('Error al eliminar configuración');
      console.error('Error deleting setting:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  clearError(): void {
    this._error.set(null);
  }
}
