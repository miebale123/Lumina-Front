import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/admin-app.config';
import { AdminApp } from './app/admin-app';
import 'zone.js'


bootstrapApplication(AdminApp, appConfig).catch((err) => console.error(err));
