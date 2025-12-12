import { HttpClient } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthStateService } from '../../../../../my-lib/src/lib/auth/auth-state.service';
import { HouseService } from './houses.service';
import { environment } from '../../../../../environments/environments';
import { RangeCategory } from './range-categ.type';
import { HouseState } from './house-state.interface';
import { initialHouseState } from './initial-house';

export type PrimitiveSearchFields = 'location' | 'price' | 'bathroom' | 'bedroom' | 'area';
export type RangeSearchFields = 'price' | 'bathroom' | 'bedroom' | 'area';

export const HousesStore = signalStore(
  { providedIn: 'root' },
  withState<HouseState>(initialHouseState),

  withMethods((store) => {
    const http = inject(HttpClient);
    const auth = inject(AuthStateService);
    const housesService = inject(HouseService);

    const myHouses = computed(() => {
      const token = auth.accessToken();
      if (!token) return [];
      const userId = jwtDecode<{ sub: number }>(token).sub;
      return store.houses().filter((h) => h.userId === userId);
    });

    function addSearchRangeToQuery(
      key: RangeCategory,
      range: { min: number | null; max: number | null },
      query: URLSearchParams
    ) {
      if (range.min !== null) query.set(`${key}Min`, String(range.min));
      if (range.max !== null) query.set(`${key}Max`, String(range.max));
    }

    return {
      myHouses,

      async uploadHouse() {
        const u = store.upload();
        const s = store.search();

        const formData = new FormData();
        formData.append('file', store.file()!);
        formData.append('location', u.location!);
        formData.append('bedroom', String(u.bedroom));
        formData.append('bathroom', String(u.bathroom));
        formData.append('price', String(u.price));
        formData.append('area', String(u.area));

        const res: any = await firstValueFrom(
          http.post(`${environment.apiBaseUrl}/houses/upload-house`, formData)
        );

        console.log('the response of upload house is: ', res);

        const newHouse = {
          ...res.savedHouse,
          assignedBrokerCompanyName: res.savedHouse.assignedBroker?.brokerCompanyName ?? null,
        };

        patchState(store, {
          houses: [...store.houses(), newHouse],
          file: null,
          search: {
            ...store.search(),
            location: null,
            price: { min: null, max: null },
            bedroom: { min: null, max: null },
            bathroom: { min: null, max: null },
            area: { min: null, max: null },
          },
        });

        return res;
      },

      async getHouses() {
        const q = new URLSearchParams();
        const s = store.search();

        if (s.location) q.set('location', s.location);
        addSearchRangeToQuery('price', s.price, q);
        addSearchRangeToQuery('bedroom', s.bedroom, q);
        addSearchRangeToQuery('bathroom', s.bathroom, q);
        addSearchRangeToQuery('area', s.area, q);

        const qs = q.toString();
        const url = qs
          ? `${environment.apiBaseUrl}/houses?${qs}`
          : `${environment.apiBaseUrl}/houses`;
        const res: any = await firstValueFrom(http.get(url));

        patchState(store, { houses: res });
      },

      async getHouse(id: string) {
        const res: any = await firstValueFrom(http.get(`${environment.apiBaseUrl}/houses/${id}`));
        patchState(store, { house: res });
      },

      async deleteHouse(id: string) {
        await firstValueFrom(http.delete(`${environment.apiBaseUrl}/houses/deleteHouse/${id}`));
        patchState(store, { houses: store.houses().filter((h) => h.id !== id) });
      },

      set<K extends keyof HouseState>(key: K, value: HouseState[K]) {
        patchState(store, { [key]: value } as any);
      },

      setUploadField(key: keyof HouseState['upload'], value: string) {
        patchState(store, {
          upload: {
            ...store.upload(),
            [key]: value,
          },
        });
      },
      setSearchField<K extends PrimitiveSearchFields>(key: K, value: string | number) {
        patchState(store, {
          search: {
            ...store.search(),
            [key]: value,
          },
        } as any);
      },

      setSearchRange<K extends RangeSearchFields>(key: K, min: number | null, max: number | null) {
        patchState(store, {
          search: {
            ...store.search(),
            [key]: { min, max },
          },
        } as any);
      },
    };
  })
);
