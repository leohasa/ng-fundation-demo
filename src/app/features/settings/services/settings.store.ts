import { Injectable, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '../../../core/services/mock-data.service';
import { Setting, CreateSettingDto, UpdateSettingDto } from '../../../core/models/setting.model';
import { BaseStore } from '../../../core/store/base.store';

@Injectable({
  providedIn: 'root'
})
export class SettingsStore extends BaseStore<Setting> {
  private readonly mockData = inject(MockDataService);

  // Selectors
  readonly settings = this.items; // Inherited from BaseStore
  readonly settingsCount = this.itemCount; // Inherited from BaseStore
  readonly hasSettings = this.hasItems; // Inherited from BaseStore

  constructor() {
    super({ autoClearError: true, errorClearTimeout: 5000 });
  }

  // Get setting value by key
  readonly getSettingValue = (key: string): string | undefined => {
    return this._items().find(s => s.key === key)?.value;
  };

  // Get setting by key
  readonly getSettingByKey = (key: string): Setting | undefined => {
    return this._items().find(s => s.key === key);
  };

  // Actions
  async loadSettings(): Promise<void> {
    return this.executeAction(async () => {
      const settings = await firstValueFrom(this.mockData.getSettings$());
      this.setItems(settings);
    }, { component: 'SettingsStore', action: 'loadSettings' });
  }

  async createSetting(dto: CreateSettingDto): Promise<void> {
    return this.executeAction(async () => {
      const newSetting = await firstValueFrom(this.mockData.createSetting$(dto));
      this.updateItems((settings: Setting[]) => [...settings, newSetting]);
    }, { component: 'SettingsStore', action: 'createSetting' });
  }

  async updateSetting(dto: UpdateSettingDto): Promise<void> {
    return this.executeAction(async () => {
      const updated = await firstValueFrom(this.mockData.updateSetting$(dto));
      this.updateItems((settings: Setting[]) => 
        settings.map((setting: Setting) => setting.id === updated.id ? updated : setting)
      );
    }, { component: 'SettingsStore', action: 'updateSetting', metadata: { id: dto.id } });
  }

  async deleteSetting(id: string): Promise<void> {
    return this.executeAction(async () => {
      await firstValueFrom(this.mockData.deleteSetting$(id));
      this.updateItems((settings: Setting[]) => settings.filter((s: Setting) => s.id !== id));
    }, { component: 'SettingsStore', action: 'deleteSetting', metadata: { id } });
  }
}
