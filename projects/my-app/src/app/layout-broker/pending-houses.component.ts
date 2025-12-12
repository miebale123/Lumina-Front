import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { BrokersStore } from '../pages/brokers/brokers.store';

@Component({
  selector: 'pending-houses',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="p-6 max-w-6xl mx-auto relative z-10 ">
      <h1 class="text-3xl font-semibold mb-6">Pending Houses Assigned to You</h1>

      <p *ngIf="store.pendingHouses().length === 0" class="text-gray-500">
        No pending houses assigned to you.
      </p>

      <div
        *ngIf="store.pendingHouses().length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          *ngFor="let h of store.pendingHouses()"
          class="border p-4 rounded-2xl shadow hover:shadow-lg transition-shadow space-y-2"
        >
          <img
            [src]="h.secure_url"
            class="w-full h-40 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
            (click)="openModal(h.secure_url)"
            alt="House Image"
          />

          <p class="font-semibold text-lg">{{ h.location }}</p>
          <p class="text-sm text-gray-600">Bedrooms: {{ h.bedroom }}</p>
          <p class="text-sm text-gray-600">Bathrooms: {{ h.bathroom }}</p>
          <p class="text-sm text-gray-600">area: {{ h.area }}</p>
          <p class="text-sm text-gray-600">assigned broker company name: {{ h.assignedBrokerCompanyName}}</p>

          <button
            (click)="approve(h.id)"
            class="w-full py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
          >
            Approve
          </button>
        </div>
      </div>

      <!-- Image Modal (like your auth modal) -->
      <div
        *ngIf="modalImage"
        class="fixed inset-0 bg-black/60 flex items-center justify-center z-99999"
      >
        <div class="bg-white w-full max-w-md p-4 rounded-lg relative">
          <!-- Close button -->
          <button
            (click)="closeModal()"
            class="absolute right-3 top-3 text-red-500 hover:text-gray-700 rounded-full bg-black"
          >
            <lucide-icon [name]="x" class="w-6 h-6"></lucide-icon>
          </button>

          <!-- Image content -->
          <img
            [src]="modalImage"
            class="w-full max-h-[70vh] object-contain rounded"
            alt="House Preview"
          />
        </div>
      </div>
    </section>
  `,
})
export class pendingHouses {
  store = inject(BrokersStore);
  modalImage: string | null = null;
  x = X;

  async ngOnInit() {
    await this.store.getPendingHouses();
  }

  approve(houseId: string) {
    this.store.approveHouse(houseId);
  }

  openModal(url: string) {
    this.modalImage = url;
  }

  closeModal() {
    this.modalImage = null;
  }
}
