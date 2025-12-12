import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BaseHeader } from 'my-lib';

@Component({
  selector: 'admin-header',
  imports: [LucideAngularModule],
  template: `
    <header
      class="left-0 right-0 z-10001 flex items-center justify-between px-4 md:px-8 py-2 bg-white backdrop-blur-md font-medium shadow-lg w-full"
    >
      <div class="flex items-center gap-6 ml-20">
        <button class="md:hidden" (click)="do()">
          <lucide-icon [name]="menu" class="w-6 h-6"></lucide-icon>
        </button>

        <h2>Admin Panel</h2>
      </div>

      <div class="hidden md:flex items-center gap-4">
        @if (auth.isLoggedIn()) {
        <a routerLink="/notifications" class="relative flex items-center">
          <lucide-icon [name]="bell" class="w-5 h-5"></lucide-icon>
        </a>

        <div class="relative">
          <button (click)="toggleDropdown()" class="flex items-center gap-2 pl-3">
            <div
              class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold uppercase"
            >
              {{ getInitial() }}
            </div>
          </button>

          @if (dropdownOpen()) {
          <div class="absolute right-0 mt-2 w-44 bg-gray-700 rounded-lg shadow-lg text-sm py-2">
            <p class="px-4 pb-2 text-gray-300 border-b border-gray-600 text-xs">
              {{ auth.userEmail() }}
            </p>

            <button (click)="go('settings')" class="px-4 py-2 text-gray-200 hover:bg-gray-600">
              Settings
            </button>
            <button
              (click)="logout()"
              class="px-4 py-2 text-gray-200 hover:bg-gray-600 flex items-center gap-2"
            >
              <lucide-icon [name]="logOut" class="w-5 h-5"></lucide-icon>
              Log out
            </button>
          </div>
          }
        </div>
        }
      </div>
    </header>
  `,
})
export class AdminHeader extends BaseHeader {}
