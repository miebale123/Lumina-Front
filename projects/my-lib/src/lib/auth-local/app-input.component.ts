import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="flex flex-col">
      <label class="mb-1 font-medium">{{ label }}</label>
      <input
        [type]="type"
        [formControl]="control"
        [placeholder]="placeholder"
        class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-500"
      />

      <div class="h-5 mt-1 text-sm text-red-500">
        @if (control.invalid && (control.dirty || control.touched)) { @if
        (control.errors?.['required']) {
        <span>{{ label }} is required</span>
        } @if (control.errors?.['email']) {
        <span>Invalid email format</span>
        } @if (control.errors?.['minlength']) {
        <span
          >{{ label }} must be at least
          {{ control.errors?.['minlength']?.requiredLength }}
          characters</span
        >
        } @if (control.errors?.['pattern']) {
        <span>Invalid format</span>
        } } @if (!control.invalid && error) {
        <span>{{ error }}</span>
        }
      </div>
    </div>
  `,
})
export class InputComponent {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) label!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() error?: string;
}
