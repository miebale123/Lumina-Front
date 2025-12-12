import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Directive, inject } from '@angular/core';
import { BaseAuthForm } from './base-auth';
import { OverlayRef } from '@angular/cdk/overlay';

@Directive()
export class BaseSignup extends BaseAuthForm {
  apiUrl = 'sign-up';
  overlayRef= inject(OverlayRef)

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
    });

    console.log('hello world from signup base');
  }

  async onSubmit() {
    this.utilsStore.startLoading('signup');

    await this.submitBase(this.apiUrl);
    this.utilsStore.stopLoading('signup');
  }
  override async afterSuccess() {
    this.overlayRef?.dispose();
    this.router.navigateByUrl('/auth/app-verification');
  }
}
