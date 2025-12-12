import { Component, inject } from '@angular/core';
import { HousesStore } from './houses.store';
import { ArrowDown, ChevronDown, Heart, LucideAngularModule } from 'lucide-angular';
import { BookmarkStore } from '../bookmarks/bookmarks.store';

@Component({
  selector: 'house',
  imports: [LucideAngularModule],
  template: `
    <div
      class="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer group relative"
    >
      <div class="relative">
        <img
          [src]="store.house()?.secure_url"
          alt="House Image"
          class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <button
          class="absolute bottom-3 right-3 bg-gray-900 bg-opacity-70 hover:bg-indigo-500 p-2 rounded-full transition flex items-center justify-center"
          (click)="bookmarks.createBookmark(store.house()!.id)"
        >
          <lucide-icon [name]="heart" class="w-5 h-5"></lucide-icon>
        </button>

        <p>brokered by {{ store.house()?.assignedBrokerCompanyName }}</p>
      </div>

      <div class="p-4 space-y-2">
        <p class="text-2xl font-bold flex items-center gap-2">$ {{ store.house()?.price }}</p>

        <div class="flex items-center gap-4  text-sm">
          <span>
            <strong>{{ store.house()?.bedroom }}</strong> bed
          </span>

          <span>
            <strong>{{ store.house()?.bathroom }}</strong> bath
          </span>

          <span>
            <strong>{{ store.house()?.area }}</strong> sqft
          </span>
        </div>

        <p class=" text-sm">
          {{ store.house()?.location }}
        </p>
      </div>
    </div>
  `,
})
export class House {
  store = inject(HousesStore);
  bookmarks = inject(BookmarkStore);

  heart = Heart;
  down = ArrowDown;
  cdown = ChevronDown;
}
