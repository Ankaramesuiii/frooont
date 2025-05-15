import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if user is logged in
  if (localStorage.getItem('isLoggedin') !== 'true') {
    // If not logged in, redirect to login
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url.split('?')[0] } });
    return false;
  }

  const requiredRoles: string[] = route.data['roles'];
  
    
  // If no roles specified, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Check if user has any of the required roles
  const hasRequiredRole = requiredRoles.some(role => authService.hasRole(role));
  
  if (!hasRequiredRole) {
    // Redirect to access denied or another safe page
    router.navigate(['/error/403']);
    return false;
  }


  return true;
};