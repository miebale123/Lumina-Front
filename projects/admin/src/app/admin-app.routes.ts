import { Routes } from '@angular/router';
import { LayoutAdmin } from './layout-admin/layout-admin.component';
import { AdminSignin } from './admin-sign-in.component';
import { PendingBrokersComponent } from './brokers/pending-brokers.component';
import { AuditPageComponent } from './audit/audit-logs.component';

export const routes: Routes = [
  { path: '', component: AdminSignin },
  {
    path: 'admin',
    component: LayoutAdmin,
    children: [
      { path: 'pending-brokers', component: PendingBrokersComponent },
      {path: 'audit-logs', component: AuditPageComponent}
    ],
  },
];
