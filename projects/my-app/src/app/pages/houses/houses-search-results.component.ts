import {
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { HousesStore } from './houses.store';
import { BookmarkStore } from '../bookmarks/bookmarks.store';
import { Router } from '@angular/router';
import { Search } from './search/search.component';
import { Filters } from './filters/filters.component';
import { Houses } from './houses.component';
import { SortBy } from './sorting/sort-by.component';

@Component({
  selector: 'houses-search-results',
  imports: [Search, Filters, Houses, SortBy],
  template: `
    <div
      class="flex flex-col md:flex-row md:items-center justify-around  py-1 px-2"
      #filterRef
      [class.fixed]="isFixed"
      [class.top-0]="isFixed"
      [class.bg-white]="isFixed"
      style="transition: all 0.3s"
    >
      <div class="flex gap-2 items-center mt-1 ">
        <search-house (search)="onSearch($event)"></search-house>
        <filters></filters>
      </div>
    </div>
    <div class="flex flex-col justify-center items-center ">
      <h2 class="font-bold text-2xl px-6 mt-4 r">Homes for Sale</h2>

      <div class="flex gap-4 p-4 px-6 items-center justify-center">
        <h3 class="text-sm md:text-base text-center md:text-left">
          {{ store.houses().length + ' ' + 'homes' }}
        </h3>
        <sort-by />
        <span class="font-bold">popular filters</span>
        <button class="border border-gray-200 bg-white shadow-lg p-2 hover:bg-gray-100">
          Min 100k
        </button>
      </div>
    </div>


    <houses></houses>
  `,
  styles: [
    `
      .fixed {
        position: fixed;
        width: 100%;
        z-index: 50;
      }
    `,
  ],
})
export class HousesSearchResults implements AfterViewInit {
  store = inject(HousesStore);
  bookmarks = inject(BookmarkStore);
  router = inject(Router);

  @ViewChild('filterRef', { static: true }) filterRef!: ElementRef;

  isFixed = false;
  heroHeight = 0;

  async ngOnInit() {
    await this.store.getHouses();
  }

  ngAfterViewInit() {
    // wait a tick in case images or dynamic content load
    setTimeout(() => {
      this.heroHeight = this.filterRef.nativeElement.offsetHeight;
    }, 0);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    this.isFixed = scrollY > this.heroHeight;
  }

  async onSearch(searchValue: string) {
    this.store.setSearchField('location', searchValue);
    await this.store.getHouses();
  }
}
