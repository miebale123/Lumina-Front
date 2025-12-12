import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hero } from './hero.component';
import { Section } from './section.component';
import { HousesStore } from '../houses/houses.store';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, Hero, Section],
  templateUrl: 'home.component.html',
})
export class Home {
  store = inject(HousesStore);
}
