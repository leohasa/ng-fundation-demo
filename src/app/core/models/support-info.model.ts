export type SupportType = 'bank_account' | 'other';

export interface SupportInfo {
  id: string;
  type: SupportType;
  title: string;
  description: string;
  isActive: boolean;
  // Campos específicos para cuentas bancarias
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  accountType?: string;
  // Campos para otras formas de apoyo
  icon?: string;
  contactInfo?: string;
}

export interface CreateSupportInfoDto {
  type: SupportType;
  title: string;
  description: string;
  isActive?: boolean;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  accountType?: string;
  icon?: string;
  contactInfo?: string;
}

export interface UpdateSupportInfoDto extends Partial<CreateSupportInfoDto> {
  id: string;
}
