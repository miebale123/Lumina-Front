import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HousesStore } from './houses.store';
import {
  LucideAngularModule,
  Heart,
  ArrowDown,
  ChevronDown,
  Phone,
  Globe,
  Bookmark,
  Bed,
} from 'lucide-angular';
import { Router } from '@angular/router';
import { BookmarkStore } from '../bookmarks/bookmarks.store';

@Component({
  selector: 'houses',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      @for(house of store.houses(); track $index) {
      <div
        class=" rounded-xl overflow-hidden shadow-lg transition cursor-pointer group relative "
        (click)="showHouse(house.id)"
      >
        <!-- House Image -->
        <div class="relative">
          <img
            [src]="house.secure_url"
            alt="House Image"
            class="w-full h-80 object-cover  transition-transform duration-300 rounded-xl"
          />

          <button
            class="absolute bottom-3 right-3 bg-white bg-opacity-70 hover:bg-indigo-200  p-2 rounded-full transition flex items-center justify-center"
            (click)="bookmarks.createBookmark(house.id)"
          >
            <lucide-icon [name]="heart" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Content -->
        <div class="p-4 space-y-2 flex flex-col">
          <span>
            <strong class="text-lg"> house for sale </strong>
          </span>

          <span>
            <strong class="text-lg">
              {{ house.price }}
              birr
            </strong>
          </span>
          <!-- Beds/Baths/Sqft -->
          <div class="flex items-center gap-4  text-sm">
            <span>
              <strong>
                {{ house.bedroom }}
              </strong>
              bed
            </span>
            <span
              ><strong> {{ house.bathroom }} </strong>bath</span
            >

            <span
              ><strong>
                {{ house.area }}
              </strong>
              sqft</span
            >
          </div>

          <!-- Location -->
          <div>
            <p class=" text-sm">{{ house.location }}</p>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class Houses {
  store = inject(HousesStore);
  bookmarks = inject(BookmarkStore);

  router = inject(Router);

  bed = Bed;

  heart = Heart;
  down = ArrowDown;
  cdown = ChevronDown;
  call = Phone;
  globe = Globe;

  async ngOnInit() {
    await this.store.getHouses();
  }

  async showHouse(id: string) {
    await this.store.getHouse(id);
    this.router.navigateByUrl('/house');
  }

  async onSearch(searchValue: string) {
    this.store.setSearchField('location', searchValue);
    await this.store.getHouses(); // filter in-place
  }
}
