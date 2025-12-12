import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BaseHeader, ModalService } from 'my-lib';
import { UserSignin } from '../pages/user-sign-in.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'header-broker',
  imports: [LucideAngularModule, RouterLink],
  template: `
    <header
      class="left-0 right-0 z-10001 flex items-center justify-between px-4 md:px-8 py-2 bg-white backdrop-blur-md font-medium shadow-lg"
    >
      <div class="flex items-center gap-6 ml-20">
        <button class="md:hidden" (click)="do()">
          <lucide-icon [name]="menu" class="w-6 h-6"></lucide-icon>
        </button>

        <h2 class="font-bold text-lg">broker panel</h2>
      </div>

      <div>
        <nav class="flex items-center justify-center gap-4">
          <a routerLink="/broker/pending-houses" class="hover:underline shadow-xl"
            >Pending Houses</a
          >
          
          <a routerLink="/broker/approved-houses" class="hover:underline shadow-xl"
            >Approved Houses</a
          >
          <a routerLink="/broker/approved-houses" class="hover:underline shadow-xl">Analytics</a>
          <a routerLink="/broker/approved-houses" class="hover:underline shadow-xl">Portfolio</a>
        </nav>
      </div>

      <div class="hidden md:flex items-center gap-4 mt-1">
        @if (!auth.isLoggedIn()) {
        <button
          (click)="
        modalservice.open(UserSignin, {
          size: 'lg',
        })
      "
        >
          sign in
        </button>

        <button
          (click)="
        modalservice.open(UserSignin, {
          size: 'lg',
        })
      "
          class="text-sm border border-white px-3 py-1 rounded-3xl bg-black text-white transition"
        >
          sign up
        </button>
        } @if (auth.isLoggedIn()) {

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
export class HeaderBroker extends BaseHeader {
  modalservice = inject(ModalService);
  UserSignin = UserSignin;
}
