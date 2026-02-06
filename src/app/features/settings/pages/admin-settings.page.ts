import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsStore } from '../services/settings.store';
import { SettingFormComponent } from '../components/setting-form.component';
import { ButtonComponent } from '../../../shared/components/button.component';
import { Setting, CreateSettingDto, UpdateSettingDto } from '../../../core/models/setting.model';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    SettingFormComponent,
    ButtonComponent
  ],
  templateUrl: './admin-settings.page.html'
})
export class AdminSettingsPage implements OnInit {
  readonly store = inject(SettingsStore);

  readonly showFormModal = signal(false);
  readonly showDeleteModal = signal(false);
  readonly selectedSetting = signal<Setting | null>(null);
  readonly settingToDelete = signal<Setting | null>(null);
  readonly saving = signal(false);
  readonly deleting = signal(false);

  ngOnInit(): void {
    this.store.loadSettings();
  }

  openCreateModal(): void {
    this.selectedSetting.set(null);
    this.showFormModal.set(true);
  }

  openEditModal(setting: Setting): void {
    this.selectedSetting.set(setting);
    this.showFormModal.set(true);
  }

  closeFormModal(): void {
    this.showFormModal.set(false);
    this.selectedSetting.set(null);
  }

  async onSave(dto: CreateSettingDto | UpdateSettingDto): Promise<void> {
    try {
      this.saving.set(true);
      
      if ('id' in dto) {
        await this.store.updateSetting(dto as UpdateSettingDto);
      } else {
        await this.store.createSetting(dto as CreateSettingDto);
      }
      
      this.closeFormModal();
    } catch (error) {
      console.error('Error saving setting:', error);
    } finally {
      this.saving.set(false);
    }
  }

  confirmDelete(setting: Setting): void {
    this.settingToDelete.set(setting);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.settingToDelete.set(null);
  }

  async deleteSetting(): Promise<void> {
    const setting = this.settingToDelete();
    if (!setting) return;

    try {
      this.deleting.set(true);
      await this.store.deleteSetting(setting.id);
      this.closeDeleteModal();
    } catch (error) {
      console.error('Error deleting setting:', error);
    } finally {
      this.deleting.set(false);
    }
  }
}
