import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export type PrimitiveSearchFields = 'location';
export type RangeSearchFields = 'price' | 'bathroom' | 'bedroom' | 'area';

export interface RangeField {
  min: number | null;
  max: number | null;
}

export interface HouseSearchState {
  location: string;
  price: RangeField;
  bathroom: RangeField;
  bedroom: RangeField;
  area: RangeField;
}

export const initialHouseSearchState: HouseSearchState = {
  location: '',
  price: { min: null, max: null },
  bathroom: { min: null, max: null },
  bedroom: { min: null, max: null },
  area: { min: null, max: null },
};

export const HouseSearchStore = signalStore(
  { providedIn: 'root' },
  withState<HouseSearchState>(initialHouseSearchState),
  withMethods((store) => ({
    setField<K extends PrimitiveSearchFields>(key: K, value: HouseSearchState[K]) {
      patchState(store, { [key]: value });
    },

    setRange<K extends RangeSearchFields>(key: K, min: number | null, max: number | null) {
      patchState(store, { [key]: { min, max } });
    },

    reset() {
      patchState(store, initialHouseSearchState);
    },

    get(): HouseSearchState {
      return {
        location: store.location(),
        price: store.price(),
        bedroom: store.bedroom(),
        bathroom: store.bathroom(),
        area: store.area(),
      };
    },
  }))
);


