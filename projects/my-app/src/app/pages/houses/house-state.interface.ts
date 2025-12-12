import { HouseResponseDto } from "./dto/house.dto";

export interface HouseState {
  upload: {
    location: string | null;
    price: number | null;
    bedroom: number | null;
    bathroom: number | null;
    area: string | null;
  };

  search: {
    location: string | null;
    price: { min: number | null; max: number | null };
    bedroom: { min: number | null; max: number | null };
    bathroom: { min: number | null; max: number | null };
    area: { min: number | null; max: number | null };
  };

  file: File | null;

  house: HouseResponseDto | null;
  houses: HouseResponseDto[];
}
