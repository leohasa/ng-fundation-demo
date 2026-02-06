import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  },
  {
    path: 'projects',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin-projects.page').then(m => m.AdminProjectsPage)
  }
];
