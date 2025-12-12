import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environments';
import { Notification } from './notification.dto';

export const NotificationsStore = signalStore(
  { providedIn: 'root' },
  withState<{
    notifications: Notification[];
    notificationCounter: number;
  }>({
    notifications: [],
    notificationCounter: 0,
  }),
  withMethods((store) => {
    const http = inject(HttpClient);

    return {
      async getNotifications() {
        const res: any = await firstValueFrom(http.get(`${environment.apiBaseUrl}/notifications`));
        const notifications = res.map((n: any) => ({
          id: n.id,
          type: n.type,
          house: { ...n.house },
          user: { id: n.user.id },
        }));
        patchState(store, { notifications, notificationCounter: notifications.length });
      },

      async deleteNotification(id: string) {
        await firstValueFrom(
          http.delete(`${environment.apiBaseUrl}/houses/deleteNotification/${id}`)
        );
        patchState(store, {
          notifications: store.notifications().filter((n) => n.id !== id),
          notificationCounter: store.notificationCounter() - 1,
        });
      },

      markAllRead() {
        patchState(store, { notificationCounter: 0 });
      },

      addNotification(n: Notification) {
        patchState(store, {
          notifications: [...store.notifications(), n],
          notificationCounter: store.notificationCounter() + 1,
        });
      },
    };
  })
);
