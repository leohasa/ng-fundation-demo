import { Component, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectsStore } from '../services/projects.store';
import { ButtonComponent } from '../../../shared/components/button.component';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TimeAgoPipe],
  templateUrl: './project-detail.page.html',
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
