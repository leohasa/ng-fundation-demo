import { Routes } from '@angular/router';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/projects-list.page').then(m => m.ProjectsListPage)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/project-detail.page').then(m => m.ProjectDetailPage)
  }
];
