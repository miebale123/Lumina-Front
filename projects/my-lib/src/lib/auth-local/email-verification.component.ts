import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environments';
import { AuthStateService } from '../auth/auth-state.service';
import { UtilsStore } from 'my-lib';
import { HttpClient } from '@angular/common/http';
import { NgOtpInputConfig, NgOtpInputModule } from 'ng-otp-input';
import { CommonModule } from '@angular/common';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verification',
  standalone: true,
  imports: [NgOtpInputModule, CommonModule, LucideAngularModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen px-4 space-y-4">
      <div class="w-full max-w-md text-center mb-4">
        <p>A verification code has been sent to your email. Enter the 6-digit code:</p>
        <p *ngIf="attemptsLeft() > 0">Attempts remaining: {{ attemptsLeft() }}</p>
        <p *ngIf="countdown() > 0" class="text-red-500">
          Too many failed attempts. Try again in {{ countdown() }} seconds.
        </p>
      </div>

      <form (ngSubmit)="onSubmit()" class="space-y-8">
        <ng-otp-input
          [config]="otpConfig"
          (onInputChange)="otp.set($event)"
          [disabled]="countdown() > 0"
        ></ng-otp-input>

        <button
          type="submit"
          [disabled]="utilsStore.isLoading('verify') || countdown() > 0 || otp().length !== 6"
          class="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl flex justify-center items-center "
        >
          @if (utilsStore.isLoading('verify')) {
          <lucide-icon [name]="lc" class="w-5 h-5 text-white animate-spin "></lucide-icon>
          }@else { verify }
        </button>
      </form>
    </div>
  `,
})
export class VerificationComponent implements OnDestroy {
  http = inject(HttpClient);
  utilsStore = inject(UtilsStore);
  router = inject(Router);
  authState = inject(AuthStateService);

  lc = LoaderCircle;
  form = FormGroup;

  otp = signal('');
  attemptsLeft = signal(5);
  lockUntil: Date | null = null;
  countdown = signal(0);
  timerInterval: any = null;

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
      this.countdown.set(0);
      this.lockUntil = null;
      this.attemptsLeft.set(5);
    }
  }

  async onSubmit() {
    this.utilsStore.startLoading('verify');

    if (this.otp().length !== 6) return;

    const email = sessionStorage.getItem('email');

    if (!email) {
      console.error('Email not found in sessionStorage');
      return;
    }

    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl}/auth/verify`, {
          email,
          otp: this.otp(),
        })
      );

      this.authState.setLoggedIn(true);
      sessionStorage.setItem('access-token', res.accessToken);
      this.authState.setAccessToken(res.accessToken);
      this.router.navigateByUrl('/');
    } catch (err: any) {
      if (err.status === 401 && err.error?.message === 'Too many attempts. Try later') {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // match backend lockout
        this.lockUntil = lockUntil;
        this.startCountdown();
      }
      if (err.status === 401 && err.error?.message === 'Invalid verification token') {
        this.attemptsLeft.set(Math.max(this.attemptsLeft() - 1, 0));
      }
      console.warn(err.error?.message || 'Verification failed');
    } finally {
      this.utilsStore.stopLoading('verify');
    }
  }

  ngOnDestroy() {
    this.stopCountdown();
  }
}
