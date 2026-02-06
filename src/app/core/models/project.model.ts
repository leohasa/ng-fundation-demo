export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  imageUrl: string;
  publishDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProjectDto {
  title: string;
  shortDescription: string;
  content: string;
  imageUrl: string;
  publishDate: Date;
  isActive?: boolean;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {
  id: string;
}
