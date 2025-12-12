import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environments';

export interface BookmarkState {
  bookmarks: any[];
}

export const BookmarkStore = signalStore(
  { providedIn: 'root' },

  withState<BookmarkState>({
    bookmarks: [],
  }),

  withMethods((store) => {
    const http = inject(HttpClient);

    return {
      async getBookmarks() {
        const res: any = await firstValueFrom(http.get(`${environment.apiBaseUrl}/bookmarks`));
        patchState(store, { bookmarks: res });
      },

      async createBookmark(houseId: string) {
        const res: any = await firstValueFrom(
          http.post(`${environment.apiBaseUrl}/bookmarks/create-bookmark`, { houseId })
        );
        patchState(store, { bookmarks: [...store.bookmarks(), res.savedBookmark] });
      },

      async deleteBookmark(id: string) {
        await firstValueFrom(
          http.delete(`${environment.apiBaseUrl}/bookmarks/deleteBookmark/${id}`)
        );
        patchState(store, { bookmarks: store.bookmarks().filter((b) => b.id !== id) });
      },

      houseBookmarks(houses: any[]) {
        const myHouseIds = houses.map((h) => h.id);
        return store.bookmarks().filter((b) => myHouseIds.includes(b.house.id));
      },
    };
  })
);
