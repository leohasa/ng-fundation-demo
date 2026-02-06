import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Verificar autenticación usando AuthService
  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir al login guardando la URL intentada
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
