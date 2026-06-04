import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { TokenStorageService } from '../services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenStorage = inject(TokenStorageService);
  const accessToken = tokenStorage.getToken()?.accessToken;

  if (!accessToken) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` }
  }));
};
