import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si está autenticado y es admin
  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  // Si no es admin, redirigir a home o unauthorized
  return router.createUrlTree(['/']);
};
