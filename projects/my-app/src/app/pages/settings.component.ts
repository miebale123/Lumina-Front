import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HousesStore } from './houses/houses.store';
import { BrokersStore } from './brokers/brokers.store';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      type="text"
      class="flex-1 text-gray-900 placeholder-gray-400 focus:outline-none border-none p-3 px-8 text-xl"
      [ngModel]="store.brokerLocation()"
      (ngModelChange)="store.set('brokerLocation', $event)"
      name="location"
      placeholder="Enter your location"
    />
    <button type="submit" class="ml-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
  `,
})
export class Settings {
  store = inject(BrokersStore);
}
