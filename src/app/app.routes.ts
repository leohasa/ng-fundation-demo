import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  // Public routes with MainLayout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/pages/home.page').then(m => m.HomePage)
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes').then(m => m.PROJECTS_ROUTES)
      },
      {
        path: 'support',
        loadChildren: () => import('./features/support/support.routes').then(m => m.SUPPORT_ROUTES)
      }
    ]
  },
  // Login page without layout
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login.page').then(m => m.LoginPage)
  },
  // Admin routes without public layout
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
