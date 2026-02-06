import { Injectable, signal, computed, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models/project.model';
import { MockDataService } from '../../../core/services/mock-data.service';
import { BaseStore } from '../../../core/store/base.store';

@Injectable({
  providedIn: 'root'
})
export class ProjectsStore extends BaseStore<Project> {
  private readonly mockData = inject(MockDataService);

  // Additional state specific to projects
  private readonly _selectedProject = signal<Project | null>(null);

  // Public readonly signals
  readonly projects = this.items; // Inherited from BaseStore
  readonly selectedProject = this._selectedProject.asReadonly();

  // Computed signals
  readonly activeProjects = computed(() => 
    this._items().filter(p => p.isActive)
  );

  readonly projectCount = this.itemCount; // Inherited from BaseStore
  readonly hasProjects = this.hasItems; // Inherited from BaseStore

  constructor() {
    super({ autoClearError: true, errorClearTimeout: 5000 });
  }

  // Actions
  async loadProjects(): Promise<void> {
    return this.executeAction(async () => {
      const projects = await firstValueFrom(this.mockData.getProjects$());
      this.setItems(projects);
    }, { component: 'ProjectsStore', action: 'loadProjects' });
  }

  async loadProject(id: string): Promise<void> {
    return this.executeAction(async () => {
      const project = await firstValueFrom(this.mockData.getProjectById$(id));
      if (!project) {
        throw new Error('Proyecto no encontrado');
      }
      this._selectedProject.set(project);
    }, { component: 'ProjectsStore', action: 'loadProject', metadata: { id } });
  }

  async createProject(dto: CreateProjectDto): Promise<void> {
    return this.executeAction(async () => {
      const newProject = await firstValueFrom(this.mockData.createProject$(dto));
      this.updateItems((projects: Project[]) => [...projects, newProject]);
    }, { component: 'ProjectsStore', action: 'createProject' });
  }

  async updateProject(dto: UpdateProjectDto): Promise<void> {
    return this.executeAction(async () => {
      const updated = await firstValueFrom(this.mockData.updateProject$(dto));
      this.updateItems((projects: Project[]) => 
        projects.map((p: Project) => p.id === dto.id ? updated : p)
      );
      
      if (this._selectedProject()?.id === dto.id) {
        this._selectedProject.set(updated);
      }
    }, { component: 'ProjectsStore', action: 'updateProject', metadata: { id: dto.id } });
  }

  async deleteProject(id: string): Promise<void> {
    return this.executeAction(async () => {
      await firstValueFrom(this.mockData.deleteProject$(id));
      this.updateItems((projects: Project[]) => projects.filter((p: Project) => p.id !== id));
      
      if (this._selectedProject()?.id === id) {
        this._selectedProject.set(null);
      }
    }, { component: 'ProjectsStore', action: 'deleteProject', metadata: { id } });
  }

  override reset(): void {
    super.reset();
    this._selectedProject.set(null);
  }
}
