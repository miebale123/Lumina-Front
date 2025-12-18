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
import { HouseSearchStore } from './houses-search.store';

@Component({
  selector: 'houses-search-results',
  imports: [Search, Filters, Houses],
  template: `
    <div
      class="flex flex-col md:flex-row md:items-center justify-around  py-1 px-2"
      #filterRef
      [class.fixed]="isFixed"
      [class.top-0]="isFixed"
      [class.bg-white]="isFixed"
      style="transition: all 0.3s"
    >
      <div class="flex items-center gap-2 px-1 py-3">
        <search-house (search)="onSearch($event)"></search-house>
        <filters></filters>
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
  searchStore = inject(HouseSearchStore);

  @ViewChild('filterRef', { static: true }) filterRef!: ElementRef;

  isFixed = false;
  heroHeight = 0;

  async ngOnInit() {
    await this.store.getHouses();
  }

  ngAfterViewInit() {
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
    this.searchStore.setField('location', searchValue);
    await this.store.getHouses();
  }
}
