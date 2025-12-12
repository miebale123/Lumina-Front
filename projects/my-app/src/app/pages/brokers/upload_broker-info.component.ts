import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrokersStore } from './brokers.store';
import { LoaderCircle, LucideAngularModule, X } from 'lucide-angular';
import { UtilsStore } from 'my-lib';

@Component({
  selector: 'upload-broker-info',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    @if (uploadedMessage()) {
    <div class="mt-4 p-3 bg-green-100 text-green-700 text-center rounded-xl font-semibold ">
      Successfully uploaded broker info
    </div>
    }

    <div class="max-w-2xl w-full p-8 rounded-2xl shadow-lg bg-white">
      <h2 class="text-3xl font-bold mb-8">Upload Broker Info</h2>

      <div class="mb-8">
        @if (!imageLocked()) {
        <label class="block cursor-pointer">
          <input type="file" accept="image/*" (change)="onFileSelected($event)" class="hidden" />

          <div
            class="
                border-2 border-dashed border-gray-300 rounded-xl p-10 text-center
                hover:border-blue-500 transition
              "
          >
            @if (!uploadedPreview()) {
            <div>
              <svg
                class="w-12 h-12 mx-auto mb-4 opacity-60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <p class="text-gray-600 font-semibold">Click to upload image</p>
            </div>
            }
          </div>
        </label>
        } @if (uploadedPreview()) {
        <div class="relative inline-block mt-6">
          <img
            [src]="uploadedPreview()"
            alt="Preview"
            class="w-full max-w-sm h-64 object-cover rounded-xl shadow-lg"
          />

          <button
            (click)="do()"
            class="
                absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full
                hover:bg-red-600 transition
              "
          >
            <lucide-icon [name]="x" class="w-6 h-6"></lucide-icon>
          </button>
        </div>
        }
      </div>

      <!-- Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label class="font-medium block mb-1">enter broker company name</label>
          <input
            type="text"
            [(ngModel)]="store.brokerCompanyName"
            placeholder="please enter Proper broker username"
            class="
              w-full px-6 py-3 rounded-xl border border-gray-700
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
              text-gray-400
            "
          />
        </div>

        <div>
          <label class="font-medium block mb-1">Location</label>
          <input
            type="text"
            [(ngModel)]="store.brokerLocation"
            placeholder="enter City / Area"
            class="
              w-full px-4 py-3 rounded-xl border border-gray-300
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none
              text-gray-400

            "
          />
        </div>

        <div class="flex gap-2 items-center">
          <input type="checkbox" name="agree" required class="hover:cursor-pointer" />
          <label>I agree to terms and conditions</label>
        </div>
      </div>

      <button
        type="submit"
        (click)="upload()"
        [disabled]="utilsStore.isLoading('upload-broker-info')"
        class="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl flex justify-center items-center"
      >
        @if (utilsStore.isLoading('upload-broker-info')) {
        <lucide-icon [name]="lc" class="w-5 h-5 animate-spin"></lucide-icon>
        } @else { submit }
      </button>
    </div>
  `,
})
export class UploadBrokerInfo {
  x = X;
  lc = LoaderCircle;
  store = inject(BrokersStore);
  utilsStore = inject(UtilsStore);
  uploadedPreview = signal<string | null>(null);

  imageLocked = signal(false);
  uploadedMessage = signal(false);

  do() {
    this.uploadedPreview.set(null);
    this.imageLocked.set(false);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.store.set('file', file);
    this.imageLocked.set(true);
    const reader = new FileReader();
    reader.onload = (e) => this.uploadedPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async upload() {
    this.utilsStore.startLoading('uploading-broker-info');
    await this.store.uploadBrokerInfo();
    this.utilsStore.stopLoading('uploading-broker-info');
    this.uploadedPreview.set(null);
    this.uploadedMessage.set(true);

    setTimeout(() => this.uploadedMessage.set(false), 2500);
  }
}
