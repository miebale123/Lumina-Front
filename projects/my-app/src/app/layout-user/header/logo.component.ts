import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'logo',
  standalone: true,
  imports: [RouterModule],
  template: `
    <a routerLink="/">
      <div class="flex items-center gap-1 justify-center">
        <img src="../../../HomeLogo.png" alt="" class="w-5 h-5" />
        <div class="md:flex">
          <span class="text-xl font-bold mt-1">Lumina</span>
        </div>
      </div>
    </a>
  `,
})
export class Logo {}
