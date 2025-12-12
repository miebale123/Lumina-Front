import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { environment } from '../../../../environments/environments';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStateService);
  const http = inject(HttpClient);

  const accessToken = sessionStorage.getItem('access-token');
  const cloned = accessToken
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      })
    : req.clone({ withCredentials: true });

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return http
          .post<{ accessToken: string }>(
            `${environment.apiBaseUrl}/auth/refresh`,
            {},
            { withCredentials: true }
          )
          .pipe(
            switchMap((res) => {
              sessionStorage.setItem('access-token', res.accessToken);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.accessToken}` },
                withCredentials: true,
              });
              return next(retryReq);
            }),
            catchError(() => {
              auth.logout();
              return throwError(() => error);
            })
          );
      }

      return throwError(() => error);
    })
  );
};
