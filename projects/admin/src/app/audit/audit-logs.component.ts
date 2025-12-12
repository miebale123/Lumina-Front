import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'audit-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <h1 class="text-4xl font-extrabold mb-8 text-gray-800">Audit Logs</h1>

      <div class="overflow-x-auto rounded-lg shadow-lg">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-100">
            <tr>
              <th class="border-b p-3 text-gray-600 uppercase text-sm">ID</th>
              <th class="border-b p-3 text-gray-600 uppercase text-sm">User ID</th>
              <th class="border-b p-3 text-gray-600 uppercase text-sm">Action</th>
              <th class="border-b p-3 text-gray-600 uppercase text-sm">IP</th>
              <th class="border-b p-3 text-gray-600 uppercase text-sm">Timestamp</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr *ngFor="let log of logs()" class="hover:bg-gray-50 transition cursor-pointer">
              <td class="border-b p-3">{{ log.id }}</td>
              <td class="border-b p-3">{{ log.userId }}</td>
              <td class="border-b p-3">{{ log.action }}</td>
              <td class="border-b p-3">{{ log.ip }}</td>
              <td class="border-b p-3">{{ log.timestamp }}</td>
            </tr>
            <tr *ngIf="logs().length === 0">
              <td colspan="5" class="p-4 text-center text-gray-500">No logs found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class AuditPageComponent {
  ip = '';
  userId = '';
  action = '';

  logs = signal<{ id: string; userId: string; action: string; ip: string; timestamp: string }[]>(
    []
  );

  http = inject(HttpClient);

  async fetchAll() {
    const data = await firstValueFrom(this.http.get(`${environment.apiBaseUrl}/audit/all`));
    this.logs.set(data as any);
  }

  async applyFilters() {
    const params = new URLSearchParams();
    if (this.ip) params.append('ip', this.ip);
    if (this.userId) params.append('userId', this.userId);
    if (this.action) params.append('action', this.action);

    const url = params.toString()
      ? `${environment.apiBaseUrl}/audit/filter?${params.toString()}`
      : `${environment.apiBaseUrl}/audit/all`;

    const data = await firstValueFrom(this.http.get(url));
    this.logs.set(data as any);
  }

  constructor() {
    this.fetchAll();
  }
}
