import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoaderCircle, X } from 'lucide-angular';
import { BaseSignin, InputComponent, SocialLogIn } from 'my-lib';
import { LucideAngularModule } from 'lucide-angular';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
  selector: 'user-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, SocialLogIn, RouterModule, InputComponent, LucideAngularModule],
  template: `
    <div class="bg-white rounded-xl p-6 w-full max-w-md relative">
      <button (click)="overlayRef.dispose()" class="absolute top-3 right-3">
        <lucide-icon [name]="x" class="w-5 h-5 text-gray-600"></lucide-icon>
      </button>

      <div class="space-y-8">
        <h2 class="text-lg font-semibold text-center">Sign in into Lumina</h2>

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
            <lucide-icon [name]="lc" class="w-5 h-5 animate-spin"></lucide-icon>
            } @else { continue }
          </button>
        </form>

        <social-login />
      </div>
    </div>
  `,
})
export class UserSignin extends BaseSignin {
  overlayRef = inject(OverlayRef);
  protected routeAfterSuccess(): void {
    if (this.authState.isExpert()) {
      this.overlayRef?.dispose();
      this.router.navigateByUrl('/broker');
      return;
    }

    this.overlayRef?.dispose();

    this.router.navigateByUrl('/');
  }

  x = X;
  lc = LoaderCircle;
}
