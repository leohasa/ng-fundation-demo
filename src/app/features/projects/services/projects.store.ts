import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models/project.model';
import { MockDataService } from '../../../core/services/mock-data.service';

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
  private readonly mockData = inject(MockDataService);

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
      const projects = await firstValueFrom(this.mockData.getProjects$());
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
      const project = await firstValueFrom(this.mockData.getProjectById$(id));
      if (!project) {
        throw new Error('Proyecto no encontrado');
      }
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
      const newProject = await firstValueFrom(this.mockData.createProject$(dto));
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
      const updated = await firstValueFrom(this.mockData.updateProject$(dto));
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
      await firstValueFrom(this.mockData.deleteProject$(id));
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
}
