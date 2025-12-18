import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { HousesApiService } from './houses-api.service';
import { HouseSearchState, RangeField } from './houses-search.store';
import { HouseUploadState } from './upload-house/upload-house.store';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';
import { RangeCategory } from './range-categ.type';

export interface HouseResponseDto {
  id: string;
  secure_url: string;
  location: string;
  price: number;
  bedroom: number;
  bathroom: number;
  area: string;
  userId: number;
  assignedBrokerCompanyName?: string;
}

export interface House {
  id: string;
  userId: number;
  location: string;
  price: number;
  bedroom: number;
  bathroom: number;
  area: string;
  secure_url: string;
  assignedBrokerCompanyName?: string;
}

export interface HousesState {
  house: House | null;
  houses: House[];
}

export const initialHousesState: HousesState = {
  house: null,
  houses: [],
};

export function addRange(key: RangeCategory, range: RangeField, q: URLSearchParams) {
  if (range.min !== null) q.set(`${key}Min`, String(range.min));
  if (range.max !== null) q.set(`${key}Max`, String(range.max));
}

export function buildHouseQuery(search: HouseSearchState) {
  const q = new URLSearchParams();

  if (search.location) q.set('location', search.location);

  addRange('price', search.price, q);
  addRange('bedroom', search.bedroom, q);
  addRange('bathroom', search.bathroom, q);
  addRange('area', search.area, q);

  return q.toString();
}



export const HousesStore = signalStore(
  { providedIn: 'root' },
  withState(initialHousesState),
  withMethods((store) => {
    const housesApi = inject(HousesApiService);
    const http = inject(HttpClient);
    const baseUrl = `${environment.apiBaseUrl}/houses`;

    return {
      async uploadHouse(upload: HouseUploadState, file: File) {
        const house = await housesApi.uploadHouse(upload, file);
        patchState(store, { houses: [...store.houses(), house] });
      },

      async getHouses(search?: HouseSearchState) {
        console.log('what u searched is: ', search)
        const qs = search ? buildHouseQuery(search) : '';
        const houses = await firstValueFrom(
          http.get<HouseResponseDto[]>(`${baseUrl}${qs ? '?' + qs : ''}`)
        );

        console.log('filtered houses are: ', houses)
        patchState(store, { houses });
      },

      async getHouse(id: string) {
        const house = await housesApi.getHouse(id);
        patchState(store, { house });
      },

      async deleteHouse(id: string) {
        await housesApi.deleteHouse(id);
        patchState(store, {
          houses: store.houses().filter((h) => h.id !== id),
        });
      },
    };
  })
);
