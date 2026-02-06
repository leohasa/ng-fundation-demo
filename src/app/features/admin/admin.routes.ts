import { Routes } from '@angular/router';
import { adminGuard } from '../../core/guards/admin.guard';
import { AdminLayoutComponent } from '../../shared/layouts/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      },
      {
        path: 'projects',
        canActivate: [adminGuard],
        loadComponent: () => import('./pages/admin-projects.page').then(m => m.AdminProjectsPage)
      },
      {
        path: 'settings',
        canActivate: [adminGuard],
        loadChildren: () => import('../settings/settings.routes').then(m => m.SETTINGS_ROUTES)
      }
    ]
  }
];
