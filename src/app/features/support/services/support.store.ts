import { Injectable, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MockDataService } from '../../../core/services/mock-data.service';
import { SupportInfo, CreateSupportInfoDto, UpdateSupportInfoDto } from '../../../core/models/support-info.model';
import { BaseStore } from '../../../core/store/base.store';

@Injectable({
  providedIn: 'root'
})
export class SupportStore extends BaseStore<SupportInfo> {
  private readonly mockData = inject(MockDataService);

  // Selectors
  readonly supportInfo = this.items; // Inherited from BaseStore

  readonly bankSupport = computed(() => 
    this._items().filter(info => info.type === 'bank_account')
  );

  readonly otherSupport = computed(() => 
    this._items().filter(info => info.type === 'other')
  );

  readonly hasBankSupport = computed(() => this.bankSupport().length > 0);
  readonly hasOtherSupport = computed(() => this.otherSupport().length > 0);

  constructor() {
    super({ autoClearError: true, errorClearTimeout: 5000 });
  }

  // Actions
  async loadSupportInfo(): Promise<void> {
    return this.executeAction(async () => {
      const info = await firstValueFrom(this.mockData.getSupportInfo$());
      this.setItems(info);
    }, { component: 'SupportStore', action: 'loadSupportInfo' });
  }

  async loadBankSupportInfo(): Promise<void> {
    return this.executeAction(async () => {
      const info = await firstValueFrom(this.mockData.getBankSupportInfo$());
      this.setItems(info);
    }, { component: 'SupportStore', action: 'loadBankSupportInfo' });
  }

  async loadOtherSupportInfo(): Promise<void> {
    return this.executeAction(async () => {
      const info = await firstValueFrom(this.mockData.getOtherSupportInfo$());
      this.setItems(info);
    }, { component: 'SupportStore', action: 'loadOtherSupportInfo' });
  }

  async createSupportInfo(dto: CreateSupportInfoDto): Promise<void> {
    return this.executeAction(async () => {
      const newInfo = await firstValueFrom(this.mockData.createSupportInfo$(dto));
      this.updateItems((info: SupportInfo[]) => [...info, newInfo]);
    }, { component: 'SupportStore', action: 'createSupportInfo' });
  }

  async updateSupportInfo(dto: UpdateSupportInfoDto): Promise<void> {
    return this.executeAction(async () => {
      const updated = await firstValueFrom(this.mockData.updateSupportInfo$(dto));
      this.updateItems((info: SupportInfo[]) => 
        info.map((item: SupportInfo) => item.id === updated.id ? updated : item)
      );
    }, { component: 'SupportStore', action: 'updateSupportInfo', metadata: { id: dto.id } });
  }

  async deleteSupportInfo(id: string): Promise<void> {
    return this.executeAction(async () => {
      await firstValueFrom(this.mockData.deleteSupportInfo$(id));
      this.updateItems((info: SupportInfo[]) => info.filter((item: SupportInfo) => item.id !== id));
    }, { component: 'SupportStore', action: 'deleteSupportInfo', metadata: { id } });
  }
}
