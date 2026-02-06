import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectsStore } from '../../projects/services/projects.store';
import { ProjectCardComponent } from '../../projects/components/project-card.component';
import { ProjectFormComponent } from '../../projects/components/project-form.component';
import { ButtonComponent } from '../../../shared/components/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models/project.model';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent,
    ProjectFormComponent,
    ButtonComponent
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Administrar Proyectos</h1>
          <p class="mt-2 text-sm text-gray-600">
            Panel de administración de proyectos
          </p>
        </div>
        <div class="flex gap-3">
          <app-button
            variant="secondary"
            (clicked)="logout()"
          >
            Cerrar Sesión
          </app-button>
          <app-button
            (clicked)="openCreateModal()"
          >
            + Nuevo Proyecto
          </app-button>
        </div>
      </div>

      <!-- User Info -->
      @if (authService.user(); as user) {
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-blue-800">
            Conectado como: <strong>{{ user.email }}</strong>
          </p>
        </div>
      }

      <!-- Loading State -->
      @if (store.loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      <!-- Projects Grid -->
      @if (!store.loading() && store.hasProjects()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (project of store.projects(); track project.id) {
            <app-project-card
              [project]="project"
              [showActions]="true"
              (edit)="openEditModal($event)"
              (delete)="confirmDelete($event)"
            />
          }
        </div>
      }

      <!-- Empty State -->
      @if (!store.loading() && !store.hasProjects()) {
        <div class="text-center py-12">
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay proyectos</h3>
          <p class="text-gray-600 mb-4">Comienza creando tu primer proyecto</p>
          <app-button (clicked)="openCreateModal()">
            Crear Proyecto
          </app-button>
        </div>
      }
    </div>

    <!-- Form Modal -->
    <app-project-form
      [isOpen]="isFormOpen()"
      [project]="selectedProject()"
      [submitting]="isSubmitting()"
      (submitted)="handleFormSubmit($event)"
      (cancelled)="closeFormModal()"
    />

    <!-- Delete Confirmation Modal (Simple Implementation) -->
    @if (projectToDelete()) {
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="fixed inset-0 bg-black bg-opacity-50"></div>
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Confirmar eliminación
            </h3>
            <p class="text-gray-600 mb-6">
              ¿Estás seguro de eliminar "{{ projectToDelete()!.title }}"?
            </p>
            <div class="flex gap-3 justify-end">
              <app-button
                variant="secondary"
                (clicked)="cancelDelete()"
              >
                Cancelar
              </app-button>
              <app-button
                variant="danger"
                (clicked)="handleDelete()"
                [disabled]="isDeleting()"
              >
                {{ isDeleting() ? 'Eliminando...' : 'Eliminar' }}
              </app-button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminProjectsPage implements OnInit {
  readonly store = inject(ProjectsStore);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isFormOpen = signal(false);
  readonly selectedProject = signal<Project | null>(null);
  readonly isSubmitting = signal(false);
  readonly projectToDelete = signal<Project | null>(null);
  readonly isDeleting = signal(false);

  ngOnInit(): void {
    this.store.loadProjects();
  }

  openCreateModal(): void {
    this.selectedProject.set(null);
    this.isFormOpen.set(true);
  }

  openEditModal(project: Project): void {
    this.selectedProject.set(project);
    this.isFormOpen.set(true);
  }

  closeFormModal(): void {
    this.isFormOpen.set(false);
    this.selectedProject.set(null);
  }

  async handleFormSubmit(dto: CreateProjectDto | UpdateProjectDto): Promise<void> {
    this.isSubmitting.set(true);

    try {
      if ('id' in dto) {
        await this.store.updateProject(dto as UpdateProjectDto);
      } else {
        await this.store.createProject(dto as CreateProjectDto);
      }
      this.closeFormModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  confirmDelete(project: Project): void {
    this.projectToDelete.set(project);
  }

  cancelDelete(): void {
    this.projectToDelete.set(null);
  }

  async handleDelete(): Promise<void> {
    const project = this.projectToDelete();
    if (!project) return;

    this.isDeleting.set(true);

    try {
      await this.store.deleteProject(project.id);
      this.cancelDelete();
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
