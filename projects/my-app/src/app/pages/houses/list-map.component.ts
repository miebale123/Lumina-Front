import { Component } from '@angular/core';

@Component({
  selector: 'list-map',
  template: `
    <!-- LIST / MAP TOGGLE (UI ONLY) -->
    <div class="flex rounded-full py-1 px-1 bg-gray-100 ">
      <button
        class="px-5 py-2 rounded-full text-sm font-medium transition
             text-gray-600 "
        [class.bg-white]="viewMode === 'list'"
        [class.shadow-xl]="viewMode === 'list'"
        [class.text-gray-900]="viewMode === 'list'"
        (click)="viewMode = 'list'"
      >
        List
      </button>
      <button
        class="px-5 py-2 rounded-full text-sm font-medium transition
             text-gray-600 "
        [class.bg-white]="viewMode === 'map'"
        [class.shadow-xl]="viewMode === 'map'"
        [class.text-gray-900]="viewMode === 'map'"
        (click)="viewMode = 'map'"
      >
        Map
      </button>
    </div>
  `,
})
export class ListMap {
  viewMode: 'list' | 'map' = 'list';
}
