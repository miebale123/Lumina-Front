import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { AdminHeader } from './admin-header.component';



@Component({
  selector: 'layout-admin',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, AdminHeader],
  template: `
    <div class="min-h-screen flex flex-col">
      <admin-header />

      <div class="flex flex-1 overflow-hidden">
        <sidebar />
        <main class="flex-1 overflow-y-auto">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class LayoutAdmin {}
