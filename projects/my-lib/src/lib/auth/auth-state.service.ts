import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { UserRole } from '../auth-local/user-role.enum';
import { JwtPayload } from '../auth-local/jwt-payload.interface';
import { environment } from '../../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  isLoggedIn = signal(!!sessionStorage.getItem('access-token'));

  private _userEmail = signal<string | null>(null);
  private _accessToken = signal<string | null>(null);
  private _userRoles = signal<UserRole[]>([]);

  userEmail = this._userEmail.asReadonly();
  accessToken = this._accessToken.asReadonly();
  userRoles = this._userRoles.asReadonly();

  http = inject(HttpClient);

  constructor() {
    const token = sessionStorage.getItem('access-token');
    if (token) this.setAccessToken(token);
  }

  setLoggedIn(value: boolean) {
    this.isLoggedIn.set(value);
  }

  setUserEmail(email: string | null) {
    this._userEmail.set(email);
  }

  setAccessToken(token: string | null) {
    this._accessToken.set(token);

    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      this._userRoles.set(decoded.roles ?? []);
      this._userEmail.set(decoded.email);
      console.log('user roles are: ', this.userRoles);
    } else {
      this._userRoles.set([]);
      this._userEmail.set(null);
    }
  }

  async refresh() {
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl}/auth/refresh`, {}, { withCredentials: true })
      );
      if (res?.accessToken) {
        sessionStorage.setItem('access-token', res.accessToken);
        this.setAccessToken(res.accessToken);
        this.setLoggedIn(true);
      }
    } catch (err) {
      console.error('Refresh failed', err);
      this.setAccessToken(null);
      this.setLoggedIn(false);
    }
  }

  router = inject(Router);

  async logout() {
    const res: any = await firstValueFrom(
      this.http.post(`${environment.apiBaseUrl}/auth/log-out`, {}, { withCredentials: true })
    );

    this.isLoggedIn.set(false);
    this._userEmail.set(null);
    this._accessToken.set(null);
    this._userRoles.set([]);
    sessionStorage.removeItem('access-token');
    this.router.navigate(['/']);
  }

  isAdmin(): boolean {
    return this._userRoles().includes(UserRole.Admin);
  }

  isExpert(): boolean {
    return this._userRoles().includes(UserRole.Expert);
  }

  hasRole(role: UserRole): boolean {
    return this._userRoles().includes(role);
  }
}
