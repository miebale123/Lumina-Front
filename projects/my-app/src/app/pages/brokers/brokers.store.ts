import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { HouseResponseDto, HousesStore } from 'my-lib';
import { HousesApiService } from '../houses/houses-api.service';

export interface BrokerDto {
  brokerLocation: string;
  brokerCompanyName: string;
}

export interface BrokerState {
  file: File | null;
  brokerLocation: string;
  brokerCompanyName: string;
  brokers: BrokerDto[];
  pendingHouses: HouseResponseDto[];
  approvedHouses: HouseResponseDto[];
}

export const initialBrokerState: BrokerState = {
  file: null,
  brokerLocation: '',
  brokerCompanyName: '',
  brokers: [],
  pendingHouses: [],
  approvedHouses: [],
};

export const BrokersStore = signalStore(
  { providedIn: 'root' },
  withState<BrokerState>(initialBrokerState),
  withMethods((store) => {
    const http = inject(HttpClient);
    const housesStore = inject(HousesStore);
    const housesApiService =inject(HousesApiService)

    return {
      async uploadBrokerInfo() {
        if (!store.file() || !store.brokerCompanyName || !store.brokerLocation) return;

        const formData = new FormData();
        formData.append('file', store.file()!);
        formData.append('brokerCompanyName', store.brokerCompanyName());
        formData.append('location', store.brokerLocation());

        const res: any = await firstValueFrom(
          http.post(`${environment.apiBaseUrl}/brokers/upload-broker-info`, formData)
        );

        patchState(store, {
          brokers: [...store.brokers(), res.savedBroker],
          file: null,
          brokerCompanyName: '',
          brokerLocation: '',
        });
      },

      async getPendingHouses() {
        const res: any = await housesApiService.getPendingHouses();
        patchState(store, { pendingHouses: res });
      },

      async getApprovedHouses() {
        const res: any = await firstValueFrom(http.get(`${environment.apiBaseUrl}/brokers/houses`));
        patchState(store, { approvedHouses: res });
      },

      async approveHouse(id: string) {
        const res: any = await housesApiService.approveHouse(id);
        const approved = res.approvedHouse;

        const updatedPending = store.pendingHouses().filter((ph) => ph.id !== id);

        const houseExists = housesStore.houses().some((h) => h.id === id);
        houseExists
          ? housesStore.houses().map((h) => (h.id === id ? approved : h))
          : [...housesStore.houses(), approved],
          patchState(store, {
            pendingHouses: updatedPending,
          });
      },

      set<K extends keyof BrokerState>(key: K, value: BrokerState[K]) {
        patchState(store, { [key]: value } as any);
      },
    };
  })
);
