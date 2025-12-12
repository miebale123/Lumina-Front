import { Component, inject } from '@angular/core';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { AuthStateService } from './auth/auth-state.service';
import { environment } from '../../../environments/environments';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'social-login',
  standalone: true,
  imports: [MatIconModule, MatIcon],
  template: `
    <div class="space-y-2">
      <p class="flex justify-center items-center">or</p>

      <!-- Google -->
      <button
        type="button"
        (click)="loginWithGoogle()"
        class="w-full flex items-center border border-gray-400 rounded-3xl p-2 font-semibold hover:bg-gray-200"
      >
        <div class="w-8 flex justify-center">
          <mat-icon svgIcon="google" class="w-5 h-5"></mat-icon>
        </div>
        <span class="flex-1 text-center">Continue with Google</span>
      </button>

      <!-- Apple -->
      <button
        type="button"
        class="w-full flex items-center border border-gray-400 rounded-3xl p-2 font-semibold hover:bg-gray-200"
      >
        <div class="w-8 flex justify-center">
          <mat-icon svgIcon="apple" class="w-5 h-5"></mat-icon>
        </div>
        <span class="flex-1 text-center">Continue with Apple</span>
      </button>

      <!-- Facebook -->
      <button
        type="button"
        class="w-full flex items-center border border-gray-400 rounded-3xl p-2 font-semibold hover:bg-gray-200"
      >
        <div class="w-8 flex justify-center">
          <mat-icon svgIcon="facebook" class="w-5 h-5"></mat-icon>
        </div>
        <span class="flex-1 text-center">Continue with Facebook</span>
      </button>
    </div>
  `,
})
export class SocialLogIn {
  auth = inject(AuthStateService);

  loginWithGoogle() {
    window.location.href = `${environment.apiBaseUrl}/auth/google`;
  }

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'google',
      sanitizer.bypassSecurityTrustResourceUrl('/icons/google.svg')
    );

    iconRegistry.addSvgIcon('apple', sanitizer.bypassSecurityTrustResourceUrl('/icons/apple.svg'));

    iconRegistry.addSvgIcon(
      'facebook',
      sanitizer.bypassSecurityTrustResourceUrl('/icons/facebook.svg')
    );
  }
}
