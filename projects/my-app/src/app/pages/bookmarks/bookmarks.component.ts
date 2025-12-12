import { Component, inject } from '@angular/core';
import { HousesStore } from '../houses/houses.store';
import { ArrowDown, LucideAngularModule, X } from 'lucide-angular';
import { BookmarkStore } from './bookmarks.store';

@Component({
  selector: 'bookmarks',
  imports: [LucideAngularModule],
  template: `
    <div class="flex-1 p-4 ">
      <h2 class="text-2xl font-semibold mb-6 ">Bookmarked Houses</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (b of bookmarks.bookmarks(); track $index) {
        <div
          class="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group relative"
        >
          <!-- House Image -->
          <div class="relative">
            <img
              [src]="b.house.secure_url"
              alt="House Image"
              class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <!-- Delete bookmark -->
            <button
              class="absolute top-3 right-3 bg-white bg-opacity-70 hover:bg-indigo-200 p-2 rounded-full transition flex items-center justify-center"
              (click)="bookmarks.deleteBookmark(b.id)"
            >
              <lucide-icon [name]="x" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <!-- Content -->
          <div class="p-4 space-y-2">
            <p class="text-2xl font-bold flex items-center gap-2">
              $ {{ b.house.price }}

              @if (b.house.priceReduced) {
              <span class="flex items-center gap-1 text-green-500 text-sm">
                <lucide-icon [name]="down" class="w-5 h-5"></lucide-icon>

                $ {{ b.house.previousPrice! - b.house.price }}
              </span>
              }
            </p>

            <!-- Beds/Baths/Sqft -->
            <div class="flex items-center gap-4 text-sm">
              <span
                ><strong>{{ b.house.bedroom }}</strong> bed</span
              >
              <span
                ><strong>{{ b.house.bathroom }}</strong> bath</span
              >
              <span
                ><strong>{{ b.house.area }}</strong> sqft</span
              >
            </div>

            <!-- Location -->
            <p class="text-sm">{{ b.house.location }}</p>
          </div>
        </div>
        }
      </div>

      @if (bookmarks.bookmarks().length === 0) {
      <p class=" text-sm mt-6">No bookmarks yet.</p>
      }
    </div>
  `,
})
export class Bookmarks {
  bookmarks = inject(BookmarkStore);
  x = X;
  down = ArrowDown;

  async ngOnInit() {
    await this.bookmarks.getBookmarks();
  }
}
