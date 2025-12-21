import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgOtpInputModule, NgOtpInputConfig } from 'ng-otp-input';
import { environment } from '../../../../environments/environments';
import { AuthStateService, UtilsStore } from 'my-lib';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [CommonModule, NgOtpInputModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md text-center mb-4">
        <p>Enter the 6-digit code sent to your email</p>

        @if (attemptsLeft() === 0 && countdown() > 0) {
        <p class="text-red-500">Too many attempts. Try again in {{ formatTime(countdown()) }}</p>
        }
      </div>

      @if (errorMessage()) {
      <p class="text-red-500 mt-3 text-sm">
        {{ errorMessage() }}
      </p>
      }

      <ng-otp-input
        [config]="otpConfig"
        [disabled]="countdown() > 0"
        (onInputChange)="otp.set($event)"
      ></ng-otp-input>

      <button
        class="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl mt-6"
        (click)="onSubmit()"
        [disabled]="otp().length !== 6 || countdown() > 0 || utilsStore.isLoading('verify')"
      >
        @if (utilsStore.isLoading('verify')) { } @else { Verify }
      </button>

      <div class="mt-4 text-sm text-gray-600">
        Didn’t receive code? @if (resendCountdown() > 0) {
        <span class="text-gray-400 ml-1"> Resend in {{ formatTime(resendCountdown()) }} </span>
        } @else {
        <button class="ml-1 font-medium hover:underline" (click)="resendOtp()">Resend</button>
        }
      </div>
    </div>
  `,
})
export class VerificationComponent implements OnInit, OnDestroy {
  http = inject(HttpClient);
  router = inject(Router);
  authState = inject(AuthStateService);
  utilsStore = inject(UtilsStore);

  otp = signal('');
  attemptsLeft = this.authState.attemptsLeft;

  lockUntil = signal<Date | null>(null);
  resendLockUntil = signal<Date | null>(null);

  countdown = signal(0);
  resendCountdown = signal(0);
  errorMessage = signal<string | null>(null);

  intervalId: any;
  resendIntervalId: any;

  otpConfig: NgOtpInputConfig = {
    length: 6,
    allowNumbersOnly: true,
  };

  ngOnInit() {
    const lockIso = this.authState.lockedUntil?.();
    const resendIso = this.authState.resendLockedUntil?.();

    if (lockIso && new Date(lockIso).getTime() > Date.now()) {
      this.startCountdown(lockIso);
    }

    if (resendIso && new Date(resendIso).getTime() > Date.now()) {
      this.startResendCountdown(resendIso);
    }
  }

  startCountdown(iso: string) {
    this.clearCountdown();

    const date = new Date(iso);
    if (date.getTime() <= Date.now()) return;

    this.lockUntil.set(date);
    this.updateCountdown();

    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const until = this.lockUntil();
    if (!until) return;

    const diff = Math.floor((until.getTime() - Date.now()) / 1000);

    if (diff <= 0) {
      this.clearCountdown();
      return;
    }

    this.countdown.set(diff);
  }

  clearCountdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.lockUntil.set(null);
    this.countdown.set(0);
  }

  startResendCountdown(iso: string) {
    this.clearResendCountdown();

    const date = new Date(iso);
    if (date.getTime() <= Date.now()) return;

    this.resendLockUntil.set(date);
    this.tickResendCountdown();

    this.resendIntervalId = setInterval(() => {
      this.tickResendCountdown();
    }, 1000);
  }

  tickResendCountdown() {
    const until = this.resendLockUntil();
    if (!until) return;

    const diff = Math.floor((until.getTime() - Date.now()) / 1000);

    if (diff <= 0) {
      this.resendCountdown.set(0);
      this.clearResendCountdown();
      return;
    }

    this.resendCountdown.set(diff);
  }

  clearResendCountdown() {
    if (this.resendIntervalId) {
      clearInterval(this.resendIntervalId);
      this.resendIntervalId = null;
    }
    this.resendLockUntil.set(null);
  }

  async onSubmit() {
    if (this.otp().length !== 6) return;

    const email = this.authState.userEmail();
    console.log('the email verification is: ', email);

    this.utilsStore.startLoading('verify');
    this.errorMessage.set(null);

    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl}/auth/verify`, {
          email,
          otp: this.otp(),
        })
      );

      // attempts always come back on failure
      if (res.attemptsLeft !== undefined) {
        this.authState.setAttemptsLeft(res.attemptsLeft);
      }

      if (res.locked && res.lockedUntil) {
        this.authState.setLockedUntil(res.lockedUntil);
        this.startCountdown(res.lockedUntil);
        return;
      }

      if (res.message === 'not match') {
        this.errorMessage.set(`Incorrect code. ${res.attemptsLeft} attempts left.`);
        this.otp.set('');
        return;
      }

      if (res.success && res.accessToken) {
        this.authState.setAttemptsLeft(0);
        this.authState.setLockedUntil(null);
        this.authState.setResendLockedUntil(null);

        this.clearCountdown();
        this.clearResendCountdown();

        this.authState.setLoggedIn(true);
        this.authState.setAccessToken(res.accessToken);
        sessionStorage.setItem('access-token', res.accessToken);

        this.router.navigateByUrl('/');
      }
    } finally {
      this.utilsStore.stopLoading('verify');
    }
  }

  async resendOtp() {
    const email = this.authState.userEmail();

    console.log('the email for sending is: ', email);

    const res: any = await firstValueFrom(
      this.http.post(`${environment.apiBaseUrl}/auth/resend-otp`, { email })
    );

    console.log('the resend otp is: ', res);

    if (res.resendLockedUntil) {
      this.authState.setResendLockedUntil(res.resendLockedUntil);
      this.startResendCountdown(res.resendLockedUntil);
    }
  }

  formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  ngOnDestroy() {
    this.clearCountdown();
    this.clearResendCountdown();
  }
}
