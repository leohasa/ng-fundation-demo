export type SupportType = 'bank' | 'other';

export interface SupportInfo {
  id: string;
  type: SupportType;
  title: string;
  description: string;
}

export interface CreateSupportInfoDto {
  type: SupportType;
  title: string;
  description: string;
}

export interface UpdateSupportInfoDto extends Partial<CreateSupportInfoDto> {
  id: string;
}
