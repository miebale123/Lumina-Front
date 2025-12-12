import { Directive, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthFormService } from '../auth/auth-form.service';
import { AuthStateService } from '../auth/auth-state.service';
import { UtilsStore } from 'my-lib';

@Directive()
export abstract class BaseAuthForm {
  utilsStore = inject(UtilsStore);

  auth = inject(AuthFormService);
  authState = inject(AuthStateService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  message = signal<string | null>(null);
  isSuccess = signal<boolean | null>(null);
  loading = signal(false);
  accessToken = signal<string>('');
  fieldErrors = signal<Partial<Record<'email' | 'password', string>>>({});

  userEmail = signal<string | null>(null);

  async submitBase(apiUrl: string) {
    await this.auth.submit({
      form: this.form,
      apiUrl,
      message: this.message,
      isSuccess: this.isSuccess,
      fieldErrors: this.fieldErrors,
      loading: this.loading,
      userEmail: this.userEmail,
      accessToken: this.accessToken,
    });

    if (this.isSuccess()) {
      this.afterSuccess();
    }
  }

  form!: FormGroup;

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  protected abstract afterSuccess(): Promise<void>;
}
