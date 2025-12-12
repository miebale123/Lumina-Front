import { HouseResponseDto } from "../houses/dto/house.dto";

export type Notification = {
  id: string;
  type: string;
  house: HouseResponseDto;
  user: { id: string };
};
