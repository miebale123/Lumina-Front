import { Directive } from '@angular/core';
import { Validators } from '@angular/forms';

import { FormControl, FormGroup } from '@angular/forms';
import { BaseAuthForm } from './base-auth';

@Directive()
export abstract class BaseSignin extends BaseAuthForm {
  apiUrl = 'sign-in';

  ngOnInit() {
    console.log('hello from signin base');
    const token = this.route.snapshot.queryParamMap.get('token');
    const email = this.route.snapshot.queryParamMap.get('email');

    if (token) {
      sessionStorage.setItem('access-token', token);
      this.authState.setAccessToken(token);
      this.authState.setLoggedIn(true);
    }

    if (email) {
      this.authState.setUserEmail(email);
    }

    this.form = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    });
  }

  async onSubmit() {
    this.utilsStore.startLoading('signin');

    await this.submitBase(this.apiUrl);
    this.utilsStore.stopLoading('signin');
  }

  protected override async afterSuccess() {
    sessionStorage.setItem('access-token', this.accessToken());
    this.authState.setLoggedIn(true);
    this.routeAfterSuccess();
  }

  protected abstract routeAfterSuccess(): void;
}
