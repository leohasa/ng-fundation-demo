import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsStore } from '../services/projects.store';
import { ProjectCardComponent } from '../components/project-card.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Proyectos</h1>
          <p class="mt-2 text-sm text-gray-600">
            Explora todos nuestros proyectos activos
          </p>
        </div>
      </div>

      <!-- Loading State -->
      @if (store.loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      <!-- Error State -->
      @if (store.error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ store.error() }}
              </h3>
            </div>
          </div>
        </div>
      }

      <!-- Empty State -->
      @if (!store.loading() && !store.hasProjects()) {
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
          <p class="mt-1 text-sm text-gray-500">Comienza creando un nuevo proyecto.</p>
        </div>
      }

      <!-- Projects Grid -->
      @if (!store.loading() && store.hasProjects()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (project of store.activeProjects(); track project.id) {
            <app-project-card [project]="project" />
          }
        </div>
      }
    </div>
  `
})
export class ProjectsListPage implements OnInit {
  readonly store = inject(ProjectsStore);

  ngOnInit(): void {
    this.store.loadProjects();
  }
}
