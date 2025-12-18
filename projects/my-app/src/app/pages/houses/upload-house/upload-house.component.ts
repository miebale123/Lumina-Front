import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HousesStore } from '../houses.store';
import { LoaderCircle, LucideAngularModule } from 'lucide-angular';
import { UtilsStore } from 'my-lib';
import { HouseUploadStore } from './upload-house.store';

@Component({
  selector: 'upload-house',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="max-w-3xl mx-auto p-2  rounded-3xl shadow-xl">
      <h2 class="text-3xl font-extrabold text-gray-800 mb-8 text-center">Upload Property</h2>

      @if (uploadedMessage()) {
      <p class="mt-4 text-green-600 font-semibold text-center">Property uploaded successfully!</p>
      }

      <form (ngSubmit)="upload()">
        <!-- Image Upload -->
        <div class="mb-8">
          <div
            class="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden"
          >
            <label
              class="absolute inset-0 w-full h-full cursor-pointer flex flex-col items-center justify-center"
              [class.opacity-50]="imageLocked() && !uploadedPreview()"
            >
              <input
                type="file"
                accept="image/*"
                (change)="onFileSelected($event)"
                class="hidden"
              />
              @if (!uploadedPreview()){
              <div class="text-center">
                <svg
                  class="w-16 h-16 mx-auto mb-4 text-gray-400"
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
                <p class="text-lg font-medium text-gray-700">Click to upload image</p>
              </div>
              }
            </label>

            <!-- Preview (absolute over container) -->
            @if (uploadedPreview()){
            <div
              class="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-white"
            >
              <img
                [src]="uploadedPreview()"
                alt="Preview"
                class="w-full h-full object-cover rounded-2xl"
              />
              <button
                type="button"
                (click)="removeImage()"
                class="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 text-white"
              >
                Remove
              </button>
            </div>
            }
          </div>
        </div>

        <!-- Property Form -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label class="block mb-2 font-semibold text-gray-700">Location</label>
            <input
              type="text"
              (input)="uploadStore.setField('location', $any($event.target).value)"
              placeholder="Enter location"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Price</label>
            <input
              (input)="uploadStore.setField('price', $any($event.target).value)"
              placeholder="Enter price"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Bedrooms</label>
            <input
              (input)="uploadStore.setField('bedroom', $any($event.target).value)"
              placeholder="Number of bedrooms"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div>
            <label class="block mb-2 font-semibold text-gray-700">Bathrooms</label>
            <input
              (input)="uploadStore.setField('bathroom', $any($event.target).value)"
              placeholder="Number of bathrooms"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div class="md:col-span-2 flex gap-4">
            <label class="block mb-2 font-semibold text-gray-700">Area (sqft)</label>
            <input
              (input)="uploadStore.setField('area', $any($event.target).value)"
              placeholder="Property area"
              class="w-full px-2 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          [disabled]="utilsStore.isLoading('upload')"
          class="w-full bg-blue-500 text-white font-bold py-3 rounded-2xl flex justify-center items-center "
        >
          @if (utilsStore.isLoading('upload')) {
          <lucide-icon [name]="lc" class="w-5 h-5 animate-spin"></lucide-icon>
          } @else { upload property }
        </button>
      </form>
    </div>
  `,
})
export class UploadHouse {
  utilsStore = inject(UtilsStore);
  uploadStore = inject(HouseUploadStore);
  housesStore = inject(HousesStore);
  uploadedPreview = signal<string | null>(null);
  imageLocked = signal(false);
  uploadedMessage = signal(false);
  lc = LoaderCircle;

  removeImage() {
    this.uploadedPreview.set(null);
    this.imageLocked.set(false);
    this.uploadedMessage.set(false);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.uploadStore.setField('file', file);
    this.imageLocked.set(true);
    const reader = new FileReader();
    reader.onload = (e) => this.uploadedPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async upload() {
    console.log('uploading');
    this.utilsStore.startLoading('upload');
    const upload = this.uploadStore.get();
    await this.housesStore.uploadHouse(upload, upload.file!);

    this.utilsStore.stopLoading('upload');
    this.uploadedPreview.set(null);
    this.uploadedMessage.set(true);
  }
}
