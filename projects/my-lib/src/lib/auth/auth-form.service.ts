import { firstValueFrom } from 'rxjs';
import { AuthFormState } from './auth-form.state';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { mapAuthError } from './auth-err.util';
import { AuthStateService } from './auth-state.service';
import { environment } from '../../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AuthFormService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  async submit(component: AuthFormState) {
    const { form, apiUrl, message, isSuccess, fieldErrors, loading, userEmail, accessToken } =
      component;

    if (form.invalid) return;

    loading.set(true);
    fieldErrors.set({});
    message.set(null);
    isSuccess.set(null);
    userEmail.set(null);

    try {
      const dto = form.value;
      const res: any = await firstValueFrom(this.http.post(`${this.baseUrl}/${apiUrl}`, dto));

      console.log('the response is: ', res);
      message.set(res?.message);
      userEmail.set(res?.email);
      isSuccess.set(true);
      form.reset();

      const token = res?.accessToken;
      if (token) {
        console.log('hello from token');
        accessToken.set(token);
        sessionStorage.setItem('access-token', token);

        this.authState.setAccessToken(token);
        this.authState.setLoggedIn(true);
      }

      if (res?.email) {
        this.authState.setUserEmail(res.email);
        console.log('the user email is: ', this.authState.userEmail());
      }

      if (res?.lockedUntil) {
        this.authState.setLockedUntil(res.lockedUntil);
      }

      if (res?.resendLockedUntil) {
        this.authState.setResendLockedUntil(res.resendLockedUntil);
      }

      if (res.attemptsLeft !== undefined) {
        this.authState.setAttemptsLeft(res.attemptsLeft);
      }
    } catch (err: any) {
      const mapped = mapAuthError(err?.error);
      if (mapped.fieldErrors) fieldErrors.set(mapped.fieldErrors);
      if (mapped.message) message.set(mapped.message);
      isSuccess.set(false);
    } finally {
      loading.set(false);
    }
  }
}
