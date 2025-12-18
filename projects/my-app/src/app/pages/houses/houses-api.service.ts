import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { HouseResponseDto } from 'my-lib';
import { map } from 'rxjs/operators';
import { RangeCategory } from './range-categ.type';
import { HouseSearchState, RangeField } from './houses-search.store';
import { HouseUploadState } from './upload-house/upload-house.store';

@Injectable({ providedIn: 'root' })
export class HousesApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/houses`;

  uploadHouse(upload: HouseUploadState, file: File): Promise<HouseResponseDto> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('location', String(upload.location));
    formData.append('price', String(upload.price));
    formData.append('bedroom', String(upload.bedroom));
    formData.append('bathroom', String(upload.bathroom));
    formData.append('area', String(upload.area));

    return firstValueFrom(
      this.http
        .post<{ savedHouse: HouseResponseDto }>(`${this.baseUrl}/upload-house`, formData)
        .pipe(map((res) => res.savedHouse))
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
    return firstValueFrom(this.http.get(`${environment.apiBaseUrl}/brokers/pendingHouses/${id}/approve`));
  }
}
