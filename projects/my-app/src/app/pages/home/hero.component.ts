import { Component, ElementRef, HostListener, inject, ViewChild, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HousesStore } from '../houses/houses.store';
import { Search } from '../houses/search/search.component';
import { LucideAngularModule, SearchIcon } from 'lucide-angular';

@Component({
  selector: 'hero',
  imports: [Search, LucideAngularModule],
  template: `
    <main
      #heroRef
      class="flex flex-col justify-start items-center text-center gap-6 px-4
         text-white hero-section h-full py-36 z-10"
    >
      <h2 class="text-3xl font-bold">Find a home that fits your life.</h2>

      <p class="text-lg ">
        Browse curated listings matched to your needs and location.
      </p>

      <div
        class="inset-x-0 mx-auto  flex justify-center transition-all duration-300 "
        [class.fixed]="isFixed"
        [class.top-0]="isFixed"
        [class.left-0]="isFixed"
        [class.right-0]="isFixed"
        [class.w-full]="isFixed"
        [class.bg-white]="isFixed"
        [class.shadow-md]="isFixed"
      >
        <search-house (search)="onSearch($event)"></search-house>
      </div>
    </main>
  `,
})
export class Hero {
  private router = inject(Router);
  private store = inject(HousesStore);

  s = SearchIcon;

  @ViewChild('heroRef', { static: true }) heroRef!: ElementRef;

  isFixed = false;
  heroHeight = 0;

  ngAfterViewInit() {
    this.heroHeight = this.heroRef.nativeElement.offsetHeight;
  }

  @HostListener('window:scroll')
  onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    this.isFixed = scrollY > this.heroHeight - 80; // adjust offset if wanted
  }

  onSearch(value: string) {
    this.store.setSearchField('location', value);
    this.router.navigateByUrl('/houses-search-results');
  }
}
