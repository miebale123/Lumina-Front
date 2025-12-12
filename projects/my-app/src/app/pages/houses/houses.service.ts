import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { HouseResponseDto } from './dto/house.dto';

@Injectable({ providedIn: 'root' })
export class HouseService {
  private http = inject(HttpClient);

  getHouses(query?: Record<string, any>) {
    const qs = query ? new URLSearchParams(query as any).toString() : '';
    return firstValueFrom(
      this.http.get<HouseResponseDto[]>(`${environment.apiBaseUrl}/houses${qs ? '?' + qs : ''}`)
    );
  }

  getHouse(id: string) {
    return firstValueFrom(
      this.http.get<HouseResponseDto>(`${environment.apiBaseUrl}/houses/${id}`)
    );
  }

  deleteHouse(id: string) {
    return firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/houses/deleteHouse/${id}`));
  }

  getPendingHouses() {
    return firstValueFrom(this.http.get(`${environment.apiBaseUrl}/brokers/pendingHouses`));
  }

  approveHouse(id: string) {
    return firstValueFrom(
      this.http.get(`${environment.apiBaseUrl}/brokers/pendingHouses/${id}/approve`)
    );
  }
}
