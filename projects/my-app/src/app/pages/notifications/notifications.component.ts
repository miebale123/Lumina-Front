import { Component, ElementRef, inject, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { io } from 'socket.io-client';
import { Router } from '@angular/router';
import { LucideAngularModule, EllipsisVertical, Trash } from 'lucide-angular';
import { AuthStateService } from '../../../../../my-lib/src/lib/auth/auth-state.service';
import { NotificationsStore } from './notifications.store';
import { HousesStore } from 'my-lib';
import { HousesApiService } from '../houses/houses-api.service';

@Component({
  selector: 'notifications',
  imports: [LucideAngularModule],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <div class="p-6 flex justify-center bg-white min-h-screen">
      <div class="w-full max-w-xl">
        <h2 class="text-3xl font-bold mb-6 text-gray-800">Notifications</h2>

        <!-- List -->
        <div class="space-y-4">
          @for (n of nStore.notifications(); track $index) {
          <div
            class="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition cursor-pointer bg-gray-50 hover:bg-gray-100 relative"
            (click)="getHouse(n.house.id)"
            #cardRef
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm text-gray-700">
                  for a house in
                  <span class="font-medium text-gray-800">{{ n.house.location }}</span>
                </p>
              </div>

              <button
                class="p-2 text-gray-400 hover:text-gray-600"
                (click)="openDropdown($event, n.id, cardRef)"
              >
                <lucide-icon [name]="ev" class="w-5 h-5"></lucide-icon>
              </button>

              @if(open() === n.id) {
              <div
                class="absolute right-0 mt-10 bg-white border border-gray-200 rounded shadow-lg z-20 w-44"
                (click)="$event.stopPropagation()"
              >
                <div
                  class="flex items-center gap-2 p-2 hover:bg-red-100 cursor-pointer text-red-600"
                  (click)="deleteNotification(n.id, $event)"
                >
                  <lucide-icon [name]="t" class="w-5 h-5"></lucide-icon>
                  <span class="text-sm font-medium">Delete notification</span>
                </div>
              </div>
              }
            </div>
          </div>
          }
        </div>

        @if (nStore.notifications().length === 0) {
        <p class="text-sm text-gray-500 mt-8 text-center">No notifications yet.</p>
        }
      </div>
    </div>
  `,
})
export class Notifications {
  nStore = inject(NotificationsStore);
  housesApiService = inject(HousesApiService);
  router = inject(Router);
  auth = inject(AuthStateService);

  socket;

  ev = EllipsisVertical;
  t = Trash;

  async ngOnInit() {
    await this.nStore.getNotifications();
  }

  constructor() {
    const token = this.auth.accessToken();
    let userId = null;

    if (token) {
      userId = jwtDecode<{ sub: number }>(token).sub;
    }

    this.socket = io('http://localhost:4442', {
      query: { userId },
    });

    this.socket.on('notification', () => {
      this.nStore.getNotifications();
    });
  }

  async getHouse(id: string) {
    await this.housesApiService.getHouse(id);
    this.router.navigateByUrl('/house');
  }

  open = signal<string | null>(null);
  activeElement: HTMLElement | null = null;

  openDropdown(event: Event, id: string, host: HTMLElement) {
    event.stopPropagation();
    this.open.set(this.open() === id ? null : id);
  }

  deleteNotification(id: string, event: Event) {
    event.stopPropagation();
    this.nStore.deleteNotification(id);
  }

  private el = inject(ElementRef);

  onDocumentClick(event: Event) {
    if (!this.activeElement) {
      this.open.set(null);
      return;
    }

    const clickedInside = this.activeElement.contains(event.target as Node);

    if (!clickedInside) {
      this.open.set(null);
    }
  }
}
