import { HttpClient } from '@angular/common/http';
import { Component, ViewChildren, QueryList, ElementRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { AuthStateService } from '../auth/auth-state.service';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';
import { UtilsStore } from 'my-lib';

@Component({
  selector: 'app-verification',
  imports: [LucideAngularModule],
  template: `
    <div
      class="verification-container  flex flex-col items-center justify-center min-h-screen px-4"
    >
      <div class="w-1/2">
        <p class=" mb-2 text-center">
          A verification code has been sent to your email. Please enter the 6-digit code below.
        </p>
      </div>

      <form class="flex flex-col items-center gap-6 w-full max-w-sm" (submit)="onSubmit($event)">
        <div class="flex gap-2 justify-center">
          @for (item of inputs; track $index) {
          <input
            #otpInput
            type="password"
            maxlength="1"
            (input)="onInput($event, $index)"
            (keydown.backspace)="onBackspace($event, $index)"
            class="w-12 h-12 text-center border rounded-md text-focus:ring-2 focus:ring-blue-500 outline-none"
          />
          }
        </div>

        <button
          type="submit"
          [disabled]="utilsStore.isLoading('verify')"
          class="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl flex justify-center items-center"
        >
          @if (utilsStore.isLoading('verify')) {
          <lucide-icon [name]="lc" class="w-5 h-5 text-white animate-spin "></lucide-icon>
          }@else {
          {{ 'verify' }}
          }
        </button>
      </form>
    </div>
  `,
})
export class VerificationComponent {
  http = inject(HttpClient);
  utilsStore = inject(UtilsStore);
  private router = inject(Router);
  authState = inject(AuthStateService);
  lc = LoaderCircle;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  inputs = Array(6).fill(0);
  otp = '';

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < this.otpInputs.length - 1) {
      this.otpInputs.get(index + 1)?.nativeElement.focus();
    }

    this.combineOtp();
  }

  onBackspace(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (!input.value && index > 0) {
      this.otpInputs.get(index - 1)?.nativeElement.focus();
    }

    this.combineOtp();
  }

  combineOtp() {
    // read all inputs and join them into a single string
    this.otp = this.otpInputs.map((el) => el.nativeElement.value).join('');
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.combineOtp();

    this.utilsStore.startLoading('verify');

    if (this.otp.length === 6) {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl}/auth/verify`, { otp: this.otp })
      );

      this.authState.setLoggedIn(true);
      sessionStorage.setItem('access-token', res.accessToken);
      this.authState.setAccessToken(res.accessToken);

      this.router.navigateByUrl('/');
      this.utilsStore.stopLoading('verify');
    } else {
      console.warn('Please enter valid 6-digit OTP code.');
      this.utilsStore.stopLoading('verify');
    }
  }
}
