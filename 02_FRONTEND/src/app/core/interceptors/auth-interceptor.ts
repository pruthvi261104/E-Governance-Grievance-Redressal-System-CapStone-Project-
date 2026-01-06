
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Token } from '../auth/token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(Token);
  const token = tokenService.getToken();

  console.log('Interceptor checking request for:', req.url);

  if (token) {
    console.log('Token found! Attaching to header...');
    
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    
    return next(authReq);
  }

  // If no token is found, we log a warning
  console.warn('No token found in TokenService. Request sent without Auth header.');
  return next(req);
};