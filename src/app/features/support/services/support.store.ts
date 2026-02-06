import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '../../../core/services/mock-data.service';
import { SupportInfo, CreateSupportInfoDto, UpdateSupportInfoDto } from '../../../core/models/support-info.model';

@Injectable({
  providedIn: 'root'
})
export class SupportStore {
  private readonly mockData = inject(MockDataService);

  // State
  private readonly _supportInfo = signal<SupportInfo[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Selectors
  readonly supportInfo = this._supportInfo.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly bankSupport = computed(() => 
    this._supportInfo().filter(info => info.type === 'bank_account')
  );

  readonly otherSupport = computed(() => 
    this._supportInfo().filter(info => info.type === 'other')
  );

  readonly hasBankSupport = computed(() => this.bankSupport().length > 0);
  readonly hasOtherSupport = computed(() => this.otherSupport().length > 0);

  // Actions
  async loadSupportInfo(): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const info = await firstValueFrom(this.mockData.getSupportInfo$());
      this._supportInfo.set(info);
    } catch (error) {
      this._error.set('Error al cargar la información de apoyo');
      console.error('Error loading support info:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async loadBankSupportInfo(): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const info = await firstValueFrom(this.mockData.getBankSupportInfo$());
      this._supportInfo.set(info);
    } catch (error) {
      this._error.set('Error al cargar cuentas bancarias');
      console.error('Error loading bank support info:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async loadOtherSupportInfo(): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const info = await firstValueFrom(this.mockData.getOtherSupportInfo$());
      this._supportInfo.set(info);
    } catch (error) {
      this._error.set('Error al cargar otras formas de apoyo');
      console.error('Error loading other support info:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async createSupportInfo(dto: CreateSupportInfoDto): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const newInfo = await firstValueFrom(this.mockData.createSupportInfo$(dto));
      this._supportInfo.update(info => [...info, newInfo]);
    } catch (error) {
      this._error.set('Error al crear información de apoyo');
      console.error('Error creating support info:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async updateSupportInfo(dto: UpdateSupportInfoDto): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const updated = await firstValueFrom(this.mockData.updateSupportInfo$(dto));
      this._supportInfo.update(info => 
        info.map(item => item.id === updated.id ? updated : item)
      );
    } catch (error) {
      this._error.set('Error al actualizar información de apoyo');
      console.error('Error updating support info:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async deleteSupportInfo(id: string): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      await firstValueFrom(this.mockData.deleteSupportInfo$(id));
      this._supportInfo.update(info => info.filter(item => item.id !== id));
    } catch (error) {
      this._error.set('Error al eliminar información de apoyo');
      console.error('Error deleting support info:', error);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  clearError(): void {
    this._error.set(null);
  }
}
