import { HouseResponseDto } from "my-lib";

export type Notification = {
  id: string;
  type: string;
  house: HouseResponseDto;
  user: { id: string };
};
