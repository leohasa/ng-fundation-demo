import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Verificar si el usuario está autenticado Y es admin usando AuthService
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Si no está autenticado, redirigir a login
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  // Si está autenticado pero no es admin, redirigir a home
  return router.createUrlTree(['/']);
};
