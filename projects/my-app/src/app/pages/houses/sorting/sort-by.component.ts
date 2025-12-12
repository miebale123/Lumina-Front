import { Component } from '@angular/core';

@Component({
  selector: 'sort-by',
  template: `
    <div class="flex items-center gap-2">
      <select
        class="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
      >
        <option>Relevant listings</option>
        <option>Newest listings</option>
        <option>Lowest price</option>
        <option>Highest price</option>
        <option>Year built</option>
      </select>
    </div>
  `,
})
export class SortBy {}
