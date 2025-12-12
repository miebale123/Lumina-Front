import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../../../../my-lib/src/lib/click-outside.directive';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-range-dropdown',
  standalone: true,
  imports: [FormsModule, ClickOutsideDirective, LucideAngularModule],
  template: `
    <div class="relative">
      <button
        (click)="toggleDropdown()"
        class="flex items-center gap-2 px-3 py-2  rounded-lg shadow-lg border border-gray-300"
      >
        <span>{{ label }}</span>
        <lucide-icon [name]="dropdown" class="w-4 h-4"></lucide-icon>
      </button>

      @if (isOpen) {
      <div
        class="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-xl p-4 z-1000"
        clickOutside
        (clickOutside)="cancel.emit()"
      >
        <h3 class="font-semibold text-sm">{{ label }} Range</h3>

        <div class="flex gap-2">
          <div class="mt-3">
            <label class="block text-sm font-medium mb-1">Min</label>
            <input class="w-full border px-2 py-1 rounded-md" [(ngModel)]="range.min" />
          </div>

          <div class="mt-3">
            <label class="block text-sm font-medium mb-1">Max</label>
            <input class="w-full border px-2 py-1 rounded-md" [(ngModel)]="range.max" />
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button (click)="onCancel()" class="px-3 py-1 text-sm border rounded-md">Cancel</button>
          <button (click)="onApply()" class="px-3 py-1 text-sm bg-black text-white rounded-md">
            Apply
          </button>
        </div>
      </div>
      }
    </div>
  `,
})
export class RangeDropdownComponent {
  dropdown = ChevronDown;
  @Input() label!: string;
  @Input() isOpen = false;
  @Input() range!: { min: number | null; max: number | null };

  @Output() toggle = new EventEmitter<void>();
  @Output() apply = new EventEmitter<{ min: number | null; max: number | null }>();
  @Output() cancel = new EventEmitter<void>();

  toggleDropdown() {
    this.toggle.emit();
  }

  onApply() {
    this.apply.emit(this.range);
  }

  onCancel() {
    this.cancel.emit();
  }
}
