export type SupportType = 'bank_account' | 'other';

export interface SupportInfo {
  id: string;
  type: SupportType;
  title: string;
  description: string;
  isActive: boolean;
}

export interface CreateSupportInfoDto {
  type: SupportType;
  title: string;
  description: string;
  isActive?: boolean;
}

export interface UpdateSupportInfoDto extends Partial<CreateSupportInfoDto> {
  id: string;
}
