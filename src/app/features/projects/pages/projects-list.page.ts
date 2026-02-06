import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsStore } from '../services/projects.store';
import { ProjectCardComponent } from '../components/project-card.component';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './projects-list.page.html'
})
export class ProjectsListPage implements OnInit {
  readonly store = inject(ProjectsStore);

  ngOnInit(): void {
    this.store.loadProjects();
  }
}
