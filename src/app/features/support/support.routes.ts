import { Routes } from '@angular/router';

export const SUPPORT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/support-list.page').then(m => m.SupportListPage)
  }
];
