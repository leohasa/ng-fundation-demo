import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { adminGuard } from '../../core/guards/admin.guard';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin-settings.page').then(m => m.AdminSettingsPage)
  }
];
