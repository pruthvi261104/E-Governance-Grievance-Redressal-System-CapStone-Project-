import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Token } from '../auth/token';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tokenService = inject(Token);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const userRole = tokenService.getRole();
  const isLoggedIn = tokenService.isLoggedIn();

  // Not logged in
  if (!isLoggedIn || !userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Role mismatch
  if (userRole !== expectedRole) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
