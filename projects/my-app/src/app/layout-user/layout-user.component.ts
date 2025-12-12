import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HousesStore } from '../pages/houses/houses.store';
import { Header } from './header/header.component';
import { Footer } from './footer/footer.component';

@Component({
  selector: 'app-layout-user',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Header, Footer],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-header />

      <main class="flex-1">
        <div class="min-h-[calc(100vh-2rem)]">
          <router-outlet></router-outlet>
        </div>
      </main>

      <app-footer />
    </div>
  `,
})
export class LayoutUserComponent {
  store = inject(HousesStore);
}
