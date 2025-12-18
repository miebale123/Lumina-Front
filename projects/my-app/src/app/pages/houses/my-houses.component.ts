// import { CommonModule } from '@angular/common';
// import { Component, inject, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HousesStore } from './houses.store';
// import { LucideAngularModule, Pencil, Trash2, Save } from 'lucide-angular';

// @Component({
//   selector: 'my-houses',
//   standalone: true,
//   imports: [CommonModule, FormsModule, LucideAngularModule],
//   template: `
//     <div class="p-6 min-h-screen">
//       <h2 class="text-2xl font-bold mb-6">Houses you uploaded</h2>

//       <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         @for (house of store.myHouses(); track $index) {

//         <div class="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition relative p-4 ">
//           @if (editingHouseId() === house.id) {
//           <!-- Editing Mode -->
//           <div class="space-y-3">
//             <label>update location:</label>
//             <input
//               type="text"
//               class="w-full p-2 rounded bg-gray-700"
//               [ngModel]="editedLocation"
//               (ngModelChange)="editedLocation = $event"
//             />

//             <label>update price:</label>
//             <input
//               class="w-full p-2 rounded bg-gray-700"
//               [ngModel]="editedPrice"
//               (ngModelChange)="editedPrice = $event"
//             />

//             <label>update bedroom:</label>
//             <input
//               class="w-full p-2 rounded bg-gray-700"
//               [ngModel]="editedBedroom"
//               (ngModelChange)="editedBedroom = $event"
//             />

//             <label>update bathroom:</label>
//             <input
//               class="w-full p-2 rounded bg-gray-700"
//               [ngModel]="editedBathroom"
//               (ngModelChange)="editedBathroom = $event"
//             />

//             <label>update area:</label>
//             <input
//               type="text"
//               class="w-full p-2 rounded bg-gray-700"
//               [ngModel]="editedArea"
//               (ngModelChange)="editedArea = $event"
//             />

//             <!-- (click)="confirmSave(house.id)" -->
//             <button
//               class="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded flex items-center justify-center gap-2"
//             >
//               <lucide-icon [name]="save" class="w-4 h-4"></lucide-icon>
//               Save
//             </button>
//           </div>

//           } @else {

//           <div>
//             <img
//               [src]="house.secure_url"
//               alt="House Image"
//               class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg mb-3"
//             />

//             <p class="text-2xl font-bold mt-1">$ {{ house.price }}</p>

//             <div class="flex items-center gap-4 text-sm mt-2">
//               <span
//                 ><strong>{{ house.bedroom }}</strong> bed</span
//               >
//               <span
//                 ><strong>{{ house.bathroom }}</strong> bath</span
//               >
//               <span
//                 ><strong>{{ house.area }}</strong> sqft</span
//               >
//             </div>

//             <p class="text-sm mt-2">{{ house.location }}</p>

//             <div class="flex gap-3 mt-4">
//               <button
//                 class="flex-1 hover:underline p-2 rounded flex items-center justify-center gap-2"
//                 (click)="startEdit(house)"
//               >
//                 <lucide-icon [name]="pencil" class="w-4 h-4"></lucide-icon>
//                 Edit
//               </button>

//               <button
//                 class="flex-1 text-red-600 hover:underline p-2 rounded flex items-center justify-center gap-2"
//                 (click)="store.deleteHouse(house.id)"
//               >
//                 <lucide-icon [name]="trash" class="w-4 h-4"></lucide-icon>
//                 Delete
//               </button>
//             </div>
//           </div>

//           }
//         </div>

//         }
//       </div>
//     </div>
//   `,
// })
// export class MyHouses {
//   store = inject(HousesStore);

//   editingHouseId = signal<string | null>(null);

//   editedLocation = '';
//   editedPrice = 0;
//   editedBedroom = 0;
//   editedBathroom = 0;
//   editedArea = '';

//   pencil = Pencil;
//   trash = Trash2;
//   save = Save;

//   startEdit(house: any) {
//     this.editingHouseId.set(house.id);
//     this.editedLocation = house.location;
//     this.editedPrice = house.price;
//     this.editedBedroom = house.bedroom;
//     this.editedBathroom = house.bathroom;
//     this.editedArea = house.area;
//   }

//   // async confirmSave(id: string) {
//   //   await this.store.updateHouse(
//   //     id,
//   //     this.editedLocation,
//   //     this.editedPrice,
//   //     this.editedBedroom,
//   //     this.editedBathroom,
//   //     this.editedArea
//   //   );

//   //   this.editingHouseId.set(null);
//   //   this.editedLocation = '';
//   //   this.editedPrice = 0;
//   //   this.editedBedroom = 0;
//   //   this.editedBathroom = 0;
//   //   this.editedArea = '';
//   // }
// }
