import {
  Apple,
  Facebook,
  Instagram,
  Linkedin,
  LucideAngularModule,
  Play,
  Youtube,
} from 'lucide-angular';

import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [LucideAngularModule, MatIconModule, RouterLink],
  template: `
    <footer class="bg-black text-white py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-wrap gap-6 justify-center text-sm mb-10">
          <a href="#" class="hover:underline">About Us</a>
          <a routerLink="broker/upload-info" class="flex items-center gap-1 hover:underline">
            Join Our Broker Network
          </a>
          <a href="#" class="hover:underline">Careers</a>
          <a href="#" class="hover:underline">Privacy</a>
          <a href="#" class="hover:underline">Terms</a>
          <a href="#" class="hover:underline">Contact</a>
          <a href="#" class="hover:underline">Advertise with us</a>
        </div>

        <div class="text-center mb-12">
          <h3 class="font-semibold text-lg mb-4">Get the app</h3>
          <div class="flex justify-center gap-4">
            <button
              class="px-1 border border-white flex w-40 items-center justify-center rounded-lg text-black bg-white"
            >
              <mat-icon svgIcon="apple" class="w-5 h-5"></mat-icon>

              <div>
                <span class="text-sm font-sm">download on the</span>
                <span class="font-bold"> Apple Store</span>
              </div>
            </button>

            <button
              class="px-1 border border-white flex w-40 items-center justify-center rounded-lg gap-2 bg-white text-black "
            >
              <mat-icon svgIcon="playstore" class="w-5 h-5"></mat-icon>

              <div class="flex flex-col leading-tight">
                <span class="text-sm">Get it on</span>
                <span class="font-bold">Google Play</span>
              </div>
            </button>
          </div>
        </div>

        <div class="flex justify-center items-center p-2">
          <div>
            <span class="font-bold">Our Products</span>
            <div class="flex flex-wrap gap-6 text-sm p-2">my product</div>
          </div>
        </div>

        <div class="flex justify-center gap-6 mb-10">
          <lucide-icon [img]="facebook" class="w-6 h-6 cursor-pointer"></lucide-icon>
          <lucide-icon [img]="insta" class="w-6 h-6 cursor-pointer"></lucide-icon>
          <lucide-icon [img]="youtube" class="w-6 h-6 cursor-pointer"></lucide-icon>
          <lucide-icon [img]="linkedIn" class="w-6 h-6 cursor-pointer"></lucide-icon>
        </div>

        <p class="text-center text-xs opacity-70">
          © {{ currentYear }} Lumina. All rights reserved.
        </p>
      </div>
    </footer>
  `,
})
export class Footer {
  facebook = Facebook;
  insta = Instagram;
  youtube = Youtube;
  linkedIn = Linkedin;

  playstore = Play;
  apple = Apple;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('apple', sanitizer.bypassSecurityTrustResourceUrl('/icons/apple.svg'));

    iconRegistry.addSvgIcon(
      'playstore',
      sanitizer.bypassSecurityTrustResourceUrl('/icons/playstore.svg')
    );
  }

  currentYear = new Date().getFullYear();
}
