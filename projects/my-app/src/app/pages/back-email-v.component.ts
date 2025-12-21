import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { AuthStateService, UtilsStore } from 'my-lib';
import { HttpClient } from '@angular/common/http';
import { NgOtpInputConfig, NgOtpInputModule } from 'ng-otp-input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [NgOtpInputModule, CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md text-center mb-4">
        <p>A verification code has been sent to your email. Enter the 6-digit code:</p>
        <p *ngIf="attemptsLeft() > 0">Attempts remaining: {{ attemptsLeft() }}</p>
        <p *ngIf="countdown() > 0" class="text-red-500">
          Too many failed attempts. Try again in {{ countdown() }} seconds.
        </p>
      </div>

      <div class="mt-4 text-sm text-gray-600">
        Didn’t receive code? @if (resendCountdown() > 0) {
        <span class="text-gray-400"> Resend – {{ formatTime(resendCountdown()) }} </span>
        } @else {
        <button
          type="button"
          (click)="resendOtp()"
          class="ml-1 text-blue-600 font-medium hover:underline"
          [disabled]="utilsStore.isLoading('resend')"
        >
          Resend
        </button>
        }
      </div>

      <ng-otp-input
        [config]="otpConfig"
        (onInputChange)="otp.set($event)"
        [disabled]="countdown() > 0"
      ></ng-otp-input>

      <button
        (click)="onSubmit()"
        [disabled]="utilsStore.isLoading('verify') || countdown() > 0 || otp().length !== 6"
        class="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl mt-6 flex justify-center items-center"
      >
        @if (utilsStore.isLoading('verify')) { }@else { Verify }
      </button>
    </div>
  `,
})
export class VerificationComponent implements OnDestroy {
  http = inject(HttpClient);
  utilsStore = inject(UtilsStore);
  router = inject(Router);
  authState = inject(AuthStateService);

  otp = signal('');
  attemptsLeft = signal(5);
  lockUntil: Date | null = null;
  countdown = signal(0);
  timerInterval: any = null;

  resendCountdown = signal(0);
  resendInterval: any = null;

  otpConfig: NgOtpInputConfig = {
    length: 6,
    allowNumbersOnly: true,
    inputStyles: {
      width: '3rem',
      height: '3rem',
      fontSize: '1.5rem',
      textAlign: 'center',
      border: '1px solid #ccc',
      borderRadius: '0.375rem',
    },
  };

  startCountdown() {
    if (!this.lockUntil) return;
    this.stopCountdown();
    const update = () => {
      const diff = Math.floor((this.lockUntil!.getTime() - Date.now()) / 1000);
      this.countdown.set(diff > 0 ? diff : 0);
      if (diff <= 0) this.stopCountdown();
    };
    update();
    this.timerInterval = setInterval(update, 1000);
  }

  stopCountdown() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.countdown.set(0);
    this.lockUntil = null;
  }

  startResendCountdown(seconds: number) {
    this.stopResendCountdown();
    this.resendCountdown.set(seconds);
    this.resendInterval = setInterval(() => {
      const value = this.resendCountdown() - 1;
      if (value <= 0) {
        this.stopResendCountdown();
      } else {
        this.resendCountdown.set(value);
      }
    }, 1000);
  }

  stopResendCountdown() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
    this.resendCountdown.set(0);
  }

  async onSubmit() {
    if (this.otp().length !== 6) return;
    const email = this.authState.userEmail();

    this.utilsStore.startLoading('verify');

    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl}/auth/verify`, {
          email,
          otp: this.otp(),
        })
      );

      // Update resend countdown from backend
      if (res.resendLocked && res.resendCountdown) {
        this.startResendCountdown(res.resendCountdown);
      }

      // Failed attempt
      if (res.message === 'not match') {
        this.attemptsLeft.set(res.attemptsLeft ?? this.attemptsLeft());
        if (res.locked && res.lockedUntil) {
          this.lockUntil = new Date(res.lockedUntil);
          this.startCountdown();
        }
        return;
      }

      // Success
      this.authState.setLoggedIn(true);
      sessionStorage.setItem('access-token', res.accessToken);
      this.authState.setAccessToken(res.accessToken);
      this.router.navigateByUrl('/');
    } catch (err: any) {
      console.warn(err.error?.message || 'Verification failed');
    } finally {
      this.utilsStore.stopLoading('verify');
    }
  }

  async resendOtp() {
    const email = this.authState.userEmail();
    this.utilsStore.startLoading('resend');

    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl}/auth/resend-otp`, { email })
      );

      if (res.resendLocked && res.resendCountdown) {
        this.startResendCountdown(res.resendCountdown);
      }
    } catch (err: any) {
      console.warn(err.error?.message || 'Resend failed');
    } finally {
      this.utilsStore.stopLoading('resend');
    }
  }

  ngOnDestroy() {
    this.stopCountdown();
    this.stopResendCountdown();
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}
