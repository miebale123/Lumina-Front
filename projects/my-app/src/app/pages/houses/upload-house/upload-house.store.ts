import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface HouseUploadState {
  location: string | null;
  price: number | null;
  bedroom: number | null;
  bathroom: number | null;
  area: string | null;
  file: File | null;
}

export const initialHouseUploadState: HouseUploadState = {
  location: null,
  price: null,
  bedroom: null,
  bathroom: null,
  area: null,
  file: null,
};

export const HouseUploadStore = signalStore(
  { providedIn: 'root' },
  withState<HouseUploadState>(initialHouseUploadState),
  withMethods((store) => ({
    setField<K extends keyof HouseUploadState>(key: K, value: HouseUploadState[K]) {
      patchState(store, { [key]: value });
    },
    reset() {
      patchState(store, initialHouseUploadState);
    },
    get(): HouseUploadState {
      return {
        location: store.location(),
        price: store.price(),
        bedroom: store.bedroom(),
        bathroom: store.bathroom(),
        area: store.area(),
        file: store.file(),
      };
    },
  }))
);
