import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectsStore } from '../services/projects.store';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CardComponent } from '../../../shared/components/card.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, TimeAgoPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      @if (store.loading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }

      @if (store.error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-800">{{ store.error() }}</p>
        </div>
      }

      @if (store.selectedProject(); as project) {
        <div class="mb-6">
          <app-button
            variant="ghost"
            (clicked)="goBack()"
          >
            ← Volver
          </app-button>
        </div>

        <article>
          <img 
            [src]="project.imageUrl" 
            [alt]="project.title"
            class="w-full h-96 object-cover rounded-lg shadow-lg mb-8"
          />

          <div class="flex items-start justify-between mb-4">
            <h1 class="text-4xl font-bold text-gray-900">
              {{ project.title }}
            </h1>
            @if (project.isActive) {
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Activo
              </span>
            }
          </div>

          <div class="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>Publicado {{ project.publishDate | timeAgo }}</span>
            <span>•</span>
            <span>{{ project.publishDate | date:'longDate' }}</span>
          </div>

          <app-card>
            <div class="prose max-w-none">
              <p class="text-lg text-gray-600 mb-6">
                {{ project.shortDescription }}
              </p>
              
              <div class="text-gray-700 whitespace-pre-wrap">
                {{ project.content }}
              </div>
            </div>
          </app-card>
        </article>
      }
    </div>
  `,
  styles: [`
    .prose {
      line-height: 1.75;
    }
  `]
})
export class ProjectDetailPage implements OnInit {
  readonly store = inject(ProjectsStore);
  private readonly router = inject(Router);

  // Usando signal input para recibir el ID de la ruta
  id = input.required<string>();

  ngOnInit(): void {
    this.store.loadProject(this.id());
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
