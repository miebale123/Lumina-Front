export interface BrokerDto {
  id: string;
  username: string | null;
  location: string | null;
  secure_url: File;
  status: 'pending' | 'active' | 'deleted' | 'rejected';
}
