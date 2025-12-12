import { HouseResponseDto } from "../houses/dto/house.dto";

export interface Broker {
  bookmarks: {
    id: string;
    house: HouseResponseDto;
    user: { id: number; email: string };
  }[];
}
