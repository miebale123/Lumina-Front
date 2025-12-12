import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Logo } from './logo.component';
import { BaseHeader } from '../../../../../my-lib/src/lib/baseHeader.component';
import { UserSignin } from '../../pages/user-sign-in.component';
import { ModalService } from 'my-lib';
import { NotificationsStore } from '../../pages/notifications/notifications.store';
import { UserSignup } from '../../pages/user-sign-up.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, Logo, RouterLink],
  templateUrl: 'header.component.html',
})
export class Header extends BaseHeader {
  UserSignin = UserSignin;
  UserSignup = UserSignup;

  modalservice = inject(ModalService);
  notificationsStore = inject(NotificationsStore);
}
