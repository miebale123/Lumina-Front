import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'admin-app-root',
  imports: [RouterModule],
  template: `<router-outlet />`,
})
export class AdminApp {}
