import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BaseSignup, InputComponent, SocialLogIn } from 'my-lib';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'user-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    SocialLogIn,
    RouterModule,
    InputComponent,
    LucideAngularModule,
  ],
  template: `
    <div class="relative z-10 flex items-center justify-center px-6 py-4 bg-white">
      <div class="space-y-8">
        <h2 class="text-lg font-semibold text-center">Sign up into Lumina</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
          <app-input
            [control]="emailControl"
            label="Email"
            type="email"
            placeholder="Enter your email"
          ></app-input>

          <app-input
            [control]="passwordControl"
            label="Password"
            type="password"
            placeholder="Enter your password"
          ></app-input>

          <button
            type="submit"
            [disabled]="utilsStore.isLoading('signup')"
            class="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl flex justify-center items-center"
          >
            @if (utilsStore.isLoading('signup')) {
            <lucide-icon [name]="lc" class="w-5 h-5 text-white animate-spin "></lucide-icon>
            }@else {
            {{ 'sign up' }}
            }
          </button>
        </form>

        <social-login />

        <div class="text-sm mt-8 flex flex-col items-center justify-center">
          By creating an account you agree to Lumina's
          <div>
            <a class="font-semibold">Terms of Use</a>
            and
            <a class="font-semibold">Privacy Policy.</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UserSignup extends BaseSignup {
  lc = LoaderCircle;
}
