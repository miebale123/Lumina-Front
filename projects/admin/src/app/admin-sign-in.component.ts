import { Component } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';
import { BaseSignin, InputComponent } from 'my-lib';

@Component({
  selector: 'admin-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, InputComponent, LucideAngularModule],
  template: `
    <div class="relative z-10 flex items-center justify-center px-4 py-4">
      <div class="w-full max-w-md bg-white rounded-xl p-6">
        <div class="space-y-8">
          <h2 class="text-lg font-semibold text-center">Admin Sign in</h2>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
            <app-input
              [control]="emailControl"
              label="Email"
              type="email"
              placeholder="Enter your email"
              [error]="fieldErrors()['email']"
            ></app-input>

            <app-input
              placeholder="Enter your password"
              label="Password"
              type="password"
              [control]="passwordControl"
              [error]="fieldErrors()['password']"
            ></app-input>

            <button
              type="submit"
              [disabled]="utilsStore.isLoading('signin')"
              class="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl flex justify-center items-center"
            >
              @if (utilsStore.isLoading('signin')) {
              <lucide-icon [name]="lc" class="w-5 h-5 text-white animate-spin "></lucide-icon>
              }@else {
              {{ 'continue' }}
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class AdminSignin extends BaseSignin {
  protected routeAfterSuccess(): void {
    this.router.navigateByUrl('/admin');
  }

  lc = LoaderCircle;
}
