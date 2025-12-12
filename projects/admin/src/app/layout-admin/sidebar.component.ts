import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <aside class="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col shadow-sm h-full">
      <div class="p-6 text-2xl font-semibold tracking-tight">Admin Panel</div>

      <nav class="flex-1 px-4 space-y-1 text-sm text-gray-700">
        <a class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition font-medium"
          >Dashboard</a
        >
        <a class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition font-medium"
          >Users</a
        >
        <a
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition font-medium"
          routerLink="/admin/pending-brokers"
          >Pending Brokers</a
        >
        <a class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition font-medium">
          Reports</a
        >
        <a class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition font-medium">
          Settings</a
        >
         <a class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition font-medium"
         routerLink="/admin/audit-logs"
         >
          Audit Logs</a
        >
      </nav>
    </aside>
  `,
})
export class SidebarComponent {}
