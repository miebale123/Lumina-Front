import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderBroker } from './header-broker.component';

@Component({
  selector: 'layout-broker',
  imports: [RouterOutlet, HeaderBroker],
  template: `
    <header-broker />
    <router-outlet />
  `,
})
export class BrokerLayoutComponent {}
