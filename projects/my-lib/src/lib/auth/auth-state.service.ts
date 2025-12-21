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

  private _lockedUntil = signal<string | null>(sessionStorage.getItem('locked-until'));

  private _resendLockedUntil = signal<string | null>(sessionStorage.getItem('resend-locked-until'));

  private _attemptsLeft = signal<number>(parseInt(sessionStorage.getItem('attempts_left') || '5'));

  userEmail = this._userEmail.asReadonly();
  accessToken = this._accessToken.asReadonly();
  userRoles = this._userRoles.asReadonly();
  lockedUntil = this._lockedUntil.asReadonly();
  resendLockedUntil = this._resendLockedUntil.asReadonly();
  attemptsLeft = this._attemptsLeft.asReadonly();

  http = inject(HttpClient);
  router = inject(Router);

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
    } else {
      this._userRoles.set([]);
      this._userEmail.set(null);
    }
  }

  setLockedUntil(iso: string | null) {
    this._lockedUntil.set(iso);

    if (iso) {
      sessionStorage.setItem('locked-until', iso);
    } else {
      sessionStorage.removeItem('locked-until');
    }
  }

  setResendLockedUntil(iso: string | null) {
    this._resendLockedUntil.set(iso);

    if (iso) {
      sessionStorage.setItem('resend-locked-until', iso);
    } else {
      sessionStorage.removeItem('resend-locked-until');
    }
  }

  setAttemptsLeft(value: number) {
    this._attemptsLeft.set(value);
    sessionStorage.setItem('attempts-left', value.toString());
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
    } catch {
      this.clearSession();
    }
  }

  async logout() {
    await firstValueFrom(
      this.http.post(`${environment.apiBaseUrl}/auth/log-out`, {}, { withCredentials: true })
    );

    this.clearSession();
    this.router.navigate(['/']);
  }

  clearSession() {
    this.isLoggedIn.set(false);
    this._userEmail.set(null);
    this._accessToken.set(null);
    this._userRoles.set([]);
    this.setLockedUntil(null);
    this.setResendLockedUntil(null);
    this.setAttemptsLeft(0);
    sessionStorage.removeItem('access-token');
  }

  isAdmin() {
    return this._userRoles().includes(UserRole.Admin);
  }

  isExpert() {
    return this._userRoles().includes(UserRole.Expert);
  }

  hasRole(role: UserRole) {
    return this._userRoles().includes(role);
  }
}
