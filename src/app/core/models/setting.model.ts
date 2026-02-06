export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export interface CreateSettingDto {
  key: string;
  value: string;
  description?: string;
}

export interface UpdateSettingDto extends Partial<CreateSettingDto> {
  id: string;
}
