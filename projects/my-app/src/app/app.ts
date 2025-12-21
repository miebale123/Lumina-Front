import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStateService } from 'my-lib';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  template: `
    <router-outlet />

  `,
})
export class App {
  authstate = inject(AuthStateService);
  hello() {
    console.log(this.authstate.userEmail());
  }
}
