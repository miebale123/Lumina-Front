import { HouseState } from './house-state.interface';

export const initialHouseState: HouseState = {


  upload: {
    location: null,
    price: null,
    bedroom: null,
    bathroom: null,
    area: null,
  },

  search: {
    location: null,
    price: { min: null, max: null },
    bedroom: { min: null, max: null },
    bathroom: { min: null, max: null },
    area: { min: null, max: null },
  },

  file: null,
  house: null,
  houses: [],
};
