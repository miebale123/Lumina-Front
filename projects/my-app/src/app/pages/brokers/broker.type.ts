import { HouseResponseDto } from "my-lib";

export interface Broker {
  bookmarks: {
    id: string;
    house: HouseResponseDto;
    user: { id: number; email: string };
  }[];
}
