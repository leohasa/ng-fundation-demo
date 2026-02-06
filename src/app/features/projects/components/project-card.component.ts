import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project } from '../../../core/models/project.model';
import { CardComponent } from '../../../shared/components/card.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, TimeAgoPipe],
  template: `
    <app-card variant="elevated" [padding]="false">
      <div class="cursor-pointer hover:opacity-90 transition-opacity">
        <img 
          [src]="project().imageUrl" 
          [alt]="project().title"
          class="w-full h-48 object-cover"
        />
        
        <div class="p-6">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-xl font-semibold text-gray-900 flex-1">
              {{ project().title }}
            </h3>
            @if (project().isActive) {
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activo
              </span>
            }
          </div>

          <p class="text-gray-600 text-sm mb-4 line-clamp-2">
            {{ project().shortDescription }}
          </p>

          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ project().publishDate | timeAgo }}</span>
            
            <div class="flex gap-2">
              <button
                type="button"
                class="text-blue-600 hover:text-blue-800 font-medium"
                [routerLink]="['/projects', project().id]"
              >
                Ver más
              </button>
              
              @if (showActions()) {
                <button
                  type="button"
                  class="text-amber-600 hover:text-amber-800 font-medium"
                  (click)="edit.emit(project())"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="text-red-600 hover:text-red-800 font-medium"
                  (click)="delete.emit(project())"
                >
                  Eliminar
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </app-card>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ProjectCardComponent {
  project = input.required<Project>();
  showActions = input<boolean>(false);

  edit = output<Project>();
  delete = output<Project>();
}
