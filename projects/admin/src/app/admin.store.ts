import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { AuthStateService } from '../../../my-lib/src/lib/auth/auth-state.service';
import { environment } from '../../../environments/environments';

export interface BrokerDto {
  id: string;
  location: string;
  brokerCompanyName: string;
  status: string;
  secure_url?: string;
  user: {email: string};
}

export interface AdminState {
  pendingBrokers: BrokerDto[];
}

export const initialAdminState: AdminState = {
  pendingBrokers: [],
};

export const AdminStore = signalStore(
  { providedIn: 'root' },
  withState<AdminState>(initialAdminState),
  withMethods((store) => {
    const http = inject(HttpClient);
    const auth = inject(AuthStateService);

    return {
      async getPendingBrokers() {
        const res: BrokerDto[] = await firstValueFrom(
          http.get<BrokerDto[]>(`${environment.apiBaseUrl}/admin-page/pendingBrokers`)
        );

        console.log('pending brokers are: ', res);
        patchState(store, { pendingBrokers: res });
      },

      async approveBroker(id: string) {
        await firstValueFrom(
          http.patch(`${environment.apiBaseUrl}/admin-page/pendingBrokers/${id}/approve`, {})
        );
        const pbs = store.pendingBrokers().filter((pb) => pb.id !== id);
        patchState(store, { pendingBrokers: pbs });
      },
    };
  })
);
