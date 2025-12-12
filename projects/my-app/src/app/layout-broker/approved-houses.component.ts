import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { BrokersStore } from '../pages/brokers/brokers.store';

@Component({
  selector: 'approved-houses',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="p-6 max-w-6xl mx-auto relative">
      <h1 class="text-3xl font-semibold mb-6">Approved Houses</h1>

      @if (store.approvedHouses().length === 0) {
      <p class="text-gray-500">No approved houses.</p>
      } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (h of store.approvedHouses(); track $index) {
        <div class="border p-4 rounded-2xl shadow hover:shadow-lg transition-shadow space-y-2">
          <img
            [src]="h.secure_url"
            class="w-full h-40 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
            (click)="openModal(h.secure_url)"
          />

          <p class="font-semibold text-lg">{{ h.location }}</p>
          <p class="text-sm text-gray-600">Bedrooms: {{ h.bedroom }}</p>
          <p class="text-sm text-gray-600">Bathrooms: {{ h.bathroom }}</p>
          <p class="text-sm text-gray-600">Area: {{ h.area }}</p>
          <p class="text-sm text-gray-600">
            assigned broker company name:
            {{ h.assignedBrokerCompanyName }}
          </p>
        </div>
        }
      </div>
      } @if (modalImage) {
      <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-99999">
        <div class="bg-white w-full max-w-md p-4 rounded-lg relative">
          <button
            (click)="closeModal()"
            class="absolute right-3 top-3 text-white hover:text-gray-300 rounded-full"
          >
            <lucide-icon [name]="x" class="w-6 h-6"></lucide-icon>
          </button>

          <img [src]="modalImage" class="w-full max-h-[70vh] object-contain rounded" />
        </div>
      </div>
      }
    </section>
  `,
})
export class ApprovedHouses {
  store = inject(BrokersStore);
  modalImage: string | null = null;
  x = X;

  ngOnInit() {
    this.store.getApprovedHouses();
  }

  openModal(url: string) {
    this.modalImage = url;
  }

  closeModal() {
    this.modalImage = null;
  }
}
