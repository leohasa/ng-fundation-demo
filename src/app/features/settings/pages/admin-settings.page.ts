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
  template: `
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Configuración del Sitio
            </h1>
            <p class="text-gray-600">
              Gestiona las configuraciones generales de tu sitio web.
            </p>
          </div>
          <app-button
            [variant]="'primary'"
            (click)="openCreateModal()"
          >
            + Nueva Configuración
          </app-button>
        </div>

        <!-- Loading State -->
        @if (store.loading()) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Cargando configuraciones...</p>
          </div>
        }

        <!-- Error State -->
        @if (store.error()) {
          <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800">{{ store.error() }}</p>
          </div>
        }

        <!-- Settings List -->
        @if (!store.loading() && store.hasSettings()) {
          <div class="bg-white shadow-sm rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clave
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (setting of store.settings(); track setting.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <code class="text-sm font-mono text-blue-600">{{ setting.key }}</code>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900 max-w-md truncate">
                        {{ setting.value }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-500 max-w-md truncate">
                        {{ setting.description || '-' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex justify-end gap-2">
                        <app-button
                          [variant]="'ghost'"
                          [size]="'sm'"
                          (click)="openEditModal(setting)"
                        >
                          Editar
                        </app-button>
                        <app-button
                          [variant]="'danger'"
                          [size]="'sm'"
                          (click)="confirmDelete(setting)"
                        >
                          Eliminar
                        </app-button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Stats -->
          <div class="mt-6 text-sm text-gray-500 text-center">
            Total: {{ store.settingsCount() }} configuraciones
          </div>
        }

        <!-- Empty State -->
        @if (!store.loading() && !store.hasSettings()) {
          <div class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              No hay configuraciones
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Comienza creando una nueva configuración.
            </p>
            <div class="mt-6">
              <app-button
                [variant]="'primary'"
                (click)="openCreateModal()"
              >
                + Nueva Configuración
              </app-button>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Form Modal -->
    <app-setting-form
      [isOpen]="showFormModal()"
      [setting]="selectedSetting()"
      [saving]="saving()"
      (save)="onSave($event)"
      (cancel)="closeFormModal()"
    />

    <!-- Delete Confirmation Modal -->
    @if (showDeleteModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            ¿Eliminar configuración?
          </h3>
          <p class="text-gray-600 mb-6">
            ¿Estás seguro de que deseas eliminar la configuración 
            <strong>{{ settingToDelete()?.key }}</strong>? 
            Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end gap-3">
            <app-button
              [variant]="'ghost'"
              (click)="closeDeleteModal()"
            >
              Cancelar
            </app-button>
            <app-button
              [variant]="'danger'"
              [disabled]="deleting()"
              (click)="deleteSetting()"
            >
              {{ deleting() ? 'Eliminando...' : 'Eliminar' }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `
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
