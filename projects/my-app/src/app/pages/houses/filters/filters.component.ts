import { Component, computed, inject, signal } from '@angular/core';
import { RangeDropdownComponent } from '../range-dropdown.component';
import { RangeCategory } from '../range-categ.type';
import { HouseSearchStore, RangeField } from '../houses-search.store';
import { HousesStore } from '../houses.store';

@Component({
  selector: 'filters',
  imports: [RangeDropdownComponent],
  standalone: true,
  templateUrl: './filters.component.html',
})
export class Filters {
  housesSearchStore = inject(HouseSearchStore);
  housesStore = inject(HousesStore);

  dropdownOpen = signal<Record<RangeCategory, boolean>>({
    price: false,
    bedroom: false,
    bathroom: false,
    area: false,
  });

  toggleDropdown(key: RangeCategory) {
    this.dropdownOpen.update((state) => ({
      ...state,
      [key]: !state[key],
    }));
  }

  applyRange(key: RangeCategory, value: RangeField) {
    this.housesSearchStore.setRange(key, value.min, value.max);
    this.toggleDropdown(key);

    // Get updated search state and pass it to HousesStore
    const search = this.housesSearchStore.get();
    this.housesStore.getHouses(search);
  }

  cancelRange(key: RangeCategory) {
    this.toggleDropdown(key);
  }

  private width = signal(window.innerWidth);

  constructor() {
    window.addEventListener('resize', () => {
      this.width.set(window.innerWidth);
    });
  }

  isDesktop = computed(() => this.width() >= 768);
}
