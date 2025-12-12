import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, SearchIcon, LoaderCircle } from 'lucide-angular';
import { HousesStore } from '../houses.store';
import { UtilsStore } from 'my-lib';

@Component({
  selector: 'search-house',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="w-full flex items-center justify-center">
      <div
        class="flex items-center w-full sm:w-[500px]
           bg-white rounded-full border border-gray-400
            py-1 pl-4 pr-2 gap-3"
      >
        <input
          type="text"
          class="flex-1 text-gray-900 text-xl text-center placeholder-gray-400
             focus:outline-none border-none p-2  ml-2"
          placeholder="Search landmark or city"
          [ngModel]="store.search.location()"
          (ngModelChange)="store.setSearchField('location', $event)"
          (keydown.enter)="onSearchClick()"
        />

        <button
          type="submit"
          [disabled]="utilsStore.isLoading('search')"
          class="p-2 bg-black text-white font-bold rounded-full flex justify-center items-center"
        >
          @if (utilsStore.isLoading('search')) {
          <lucide-icon [name]="lc" class="w-5 h-5 text-white animate-spin "></lucide-icon>
          }@else {
          <lucide-icon [name]="s" class="w-5 h-5 text-white "></lucide-icon>
          }
        </button>
      </div>
    </div>
  `,
})
export class Search {
  utilsStore = inject(UtilsStore);
  store = inject(HousesStore);
  lc = LoaderCircle;
  s = SearchIcon;

  @Output() search = new EventEmitter<string>();

  @Input() trySuggestion = true;

  async onSearchClick() {
    this.utilsStore.startLoading('search');
    await new Promise((r) => setTimeout(r, 1000));

    this.utilsStore.stopLoading('search');
    this.search.emit(this.store.search.location()!);
  }
}
