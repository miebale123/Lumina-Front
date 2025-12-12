import { Component, inject, signal } from '@angular/core';
import { HousesStore } from '../houses.store';
import { RangeCategory } from '../range-categ.type';
import { RangeDropdownComponent } from '../range-dropdown.component';

@Component({
  selector: 'filters',
  imports: [RangeDropdownComponent],
  standalone: true,
  templateUrl: './filters.component.html',
})
export class Filters {
  store = inject(HousesStore);

  priceOpen = signal(false);
  bedroomOpen = signal(false);
  bathroomOpen = signal(false);

  toggleDropdown(key: RangeCategory) {
    if (key === 'price') this.priceOpen.update((v) => !v);
    if (key === 'bedroom') this.bedroomOpen.update((v) => !v);
    if (key === 'bathroom') this.bathroomOpen.update((v) => !v);
  }

  applyRange(key: RangeCategory, value: { min: number | null; max: number | null }) {
    this.store.setSearchRange(key, value.min, value.max);

    if (key === 'price') this.priceOpen.update((v) => !v);
    if (key === 'bedroom') this.bedroomOpen.update((v) => !v);
    if (key === 'bathroom') this.bathroomOpen.update((v) => !v);

    this.store.getHouses();
  }

  cancelRange(key: RangeCategory) {
    if (key === 'price') this.priceOpen.update((v) => !v);
    if (key === 'bedroom') this.bedroomOpen.update((v) => !v);
    if (key === 'bathroom') this.bathroomOpen.update((v) => !v);
  }
}
