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
  templateUrl: './admin-projects.page.html'
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
