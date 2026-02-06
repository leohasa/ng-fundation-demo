import { Injectable, signal, computed, inject } from '@angular/core';
import { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models/project.model';
import { ApiService } from '../../../core/services/api.service';

export interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsStore {
  private readonly api = inject(ApiService);

  // State signals
  private readonly _projects = signal<Project[]>([]);
  private readonly _selectedProject = signal<Project | null>(null);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public readonly signals
  readonly projects = this._projects.asReadonly();
  readonly selectedProject = this._selectedProject.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computed signals
  readonly activeProjects = computed(() => 
    this._projects().filter(p => p.isActive)
  );

  readonly projectCount = computed(() => this._projects().length);

  readonly hasProjects = computed(() => this._projects().length > 0);

  // Actions
  async loadProjects(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      // Simular llamada API - reemplazar con llamada real
      const projects = await this.mockFetchProjects();
      this._projects.set(projects);
    } catch (error: any) {
      this._error.set(error.message || 'Error al cargar proyectos');
      console.error('Error loading projects:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async loadProject(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const project = await this.mockFetchProject(id);
      this._selectedProject.set(project);
    } catch (error: any) {
      this._error.set(error.message || 'Error al cargar proyecto');
      console.error('Error loading project:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async createProject(dto: CreateProjectDto): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const newProject = await this.mockCreateProject(dto);
      this._projects.update(projects => [...projects, newProject]);
    } catch (error: any) {
      this._error.set(error.message || 'Error al crear proyecto');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async updateProject(dto: UpdateProjectDto): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const updated = await this.mockUpdateProject(dto);
      this._projects.update(projects => 
        projects.map(p => p.id === dto.id ? updated : p)
      );
      
      if (this._selectedProject()?.id === dto.id) {
        this._selectedProject.set(updated);
      }
    } catch (error: any) {
      this._error.set(error.message || 'Error al actualizar proyecto');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async deleteProject(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      await this.mockDeleteProject(id);
      this._projects.update(projects => projects.filter(p => p.id !== id));
      
      if (this._selectedProject()?.id === id) {
        this._selectedProject.set(null);
      }
    } catch (error: any) {
      this._error.set(error.message || 'Error al eliminar proyecto');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  clearError(): void {
    this._error.set(null);
  }

  // Mock methods - reemplazar con llamadas reales al API
  private async mockFetchProjects(): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        title: 'Proyecto Demo 1',
        shortDescription: 'Descripción corta del proyecto 1',
        content: 'Contenido completo del proyecto 1',
        imageUrl: 'https://via.placeholder.com/400x300',
        publishDate: new Date('2024-01-15'),
        isActive: true
      },
      {
        id: '2',
        title: 'Proyecto Demo 2',
        shortDescription: 'Descripción corta del proyecto 2',
        content: 'Contenido completo del proyecto 2',
        imageUrl: 'https://via.placeholder.com/400x300',
        publishDate: new Date('2024-02-01'),
        isActive: true
      }
    ];
  }

  private async mockFetchProject(id: string): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const projects = await this.mockFetchProjects();
    const project = projects.find(p => p.id === id);
    if (!project) throw new Error('Proyecto no encontrado');
    return project;
  }

  private async mockCreateProject(dto: CreateProjectDto): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now().toString(),
      ...dto,
      isActive: dto.isActive ?? true
    };
  }

  private async mockUpdateProject(dto: UpdateProjectDto): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const project = await this.mockFetchProject(dto.id);
    return { ...project, ...dto };
  }

  private async mockDeleteProject(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
