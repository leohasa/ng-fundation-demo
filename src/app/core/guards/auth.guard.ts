import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verificar el flag en localStorage
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (isAdmin) {
    return true;
  }

  // Redirigir al login guardando la URL intentada
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
