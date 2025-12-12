// import { Component, inject } from '@angular/core';
// import { LucideAngularModule, X } from 'lucide-angular';
// import { Signup } from '../../../../../my-lib/src/lib/auth-local/sign-up.component';
// import { UserSignin } from '../../pages/user-sign-in.component';
// import { GlobalModalStore } from 'my-lib';

// @Component({
//   selector: 'auth-modal',
//   imports: [LucideAngularModule, Signup, UserSignin],
//   template: `
//     @if (modalstore.authmodal()) {
//     <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-99999">
//       <div class="bg-white w-full max-w-sm p-4 rounded-lg relative">
//         <!-- Close button -->
//         <button (click)="utilsStore.closeAuth()" class="absolute right-3 top-1 text-gray-500">
//           <lucide-icon [name]="x" class="w-6 h-6"></lucide-icon>
//         </button>

//         @if (utilsStore.authMode()==='sign-in') {
//         <user-sign-in />
//         } @if (utilsStore.authMode() === 'sign-up') {
//         <sign-up />
//         }
//       </div>
//     </div>
//     }
//   `,
// })
// export class AuthModal {
//   utilsStore = inject(GlobalModalStore);
//   x = X;
// }
