import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminStore } from '../admin.store';

@Component({
  selector: 'pending-brokers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-center">Pending Broker Verification</h1>

      @if (store.pendingBrokers().length > 0) {
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (broker of store.pendingBrokers(); track $index) {
        <div class="border rounded-2xl p-4 shadow-lg space-y-4 cursor-pointer">
          <div class="space-y-1 text-center">
            <img class="font-semibold" [src]="broker.secure_url" />
            <p class="font-semibold">location: {{ broker.location }}</p>
            <p class="font-semibold">email: {{ broker.user.email }}</p>
            <p class="font-semibold">brokerCompanyName: {{ broker.brokerCompanyName }}</p>
          </div>

          <button
            (click)="approve(broker); $event.stopPropagation()"
            class="w-full py-2 rounded bg-blue-500 text-white"
          >
            Approve Broker
          </button>
        </div>
        }
      </div>
      } @else {
      <p class="text-center text-gray-500">No pending brokers.</p>
      }
    </div>
  `,
})
export class PendingBrokersComponent {
  store = inject(AdminStore);

  async ngOnInit() {
    await this.store.getPendingBrokers();
  }

  approve(broker: any) {
    this.store.approveBroker(broker.id);
  }
}
