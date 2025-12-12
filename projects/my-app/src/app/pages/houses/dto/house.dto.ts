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
