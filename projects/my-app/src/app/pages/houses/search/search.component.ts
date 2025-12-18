import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, SearchIcon, LoaderCircle } from 'lucide-angular';
import { UtilsStore } from 'my-lib';
import { HouseSearchStore } from '../houses-search.store';
@Component({
  selector: 'search-house',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div
      class="flex items-center justify-center
            rounded-full shadow-xl
            py-1 border border-gray-400 bg-white"
    >
      <input
        type="text"
        class="max-w-xs  w-full text-black placeholder-gray-400 ml-4 focus:outline-none border-none"
        placeholder="Search landmark or city"
        [ngModel]="searchStore.location()"
        (ngModelChange)="searchStore.setField('location', $event)"
        (keydown.enter)="onSearchClick()"
      />

      <button
        type="submit"
        [disabled]="utilsStore.isLoading('search')"
        class="p-2 bg-black text-white font-bold rounded-full flex justify-center items-center mr-1"
      >
        @if (utilsStore.isLoading('search')) {
        <lucide-icon [name]="lc" class="w-5 h-5 animate-spin"></lucide-icon>
        } @else {
        <lucide-icon [name]="s" class="w-5 h-5"></lucide-icon>
        }
      </button>
    </div>
  `,
})
export class Search {
  utilsStore = inject(UtilsStore);
  searchStore = inject(HouseSearchStore);

  lc = LoaderCircle;
  s = SearchIcon;

  @Output() search = new EventEmitter<string>();
  @Input() trySuggestion = true;

  async onSearchClick() {
    this.utilsStore.startLoading('search');
    await new Promise((r) => setTimeout(r, 1000));
    this.utilsStore.stopLoading('search');

    this.search.emit(this.searchStore.location());
  }
}
