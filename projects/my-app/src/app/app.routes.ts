import { Routes } from '@angular/router';
import { Home } from './pages/home/home.component';
import { Houses } from './pages/houses/houses.component';
import { UploadBrokerInfo } from './pages/brokers/upload_broker-info.component';
import { HousesSearchResults } from './pages/houses/houses-search-results.component';
import { VerificationComponent } from 'my-lib';
import { LayoutUserComponent } from './layout-user/layout-user.component';
import { UploadHouse } from './pages/houses/upload-house/upload-house.component';
import { UserSignup } from './pages/user-sign-up.component';
import { UserSignin } from './pages/user-sign-in.component';
import { BrokerLayoutComponent } from './layout-broker/layout-broker.component';
import { pendingHouses } from './layout-broker/pending-houses.component';
import { ApprovedHouses } from './layout-broker/approved-houses.component';
import { Bookmarks } from './pages/bookmarks/bookmarks.component';
import { Notifications } from './pages/notifications/notifications.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'user-sign-up', component: UserSignup },
      { path: 'user-sign-in', component: UserSignin },
      { path: 'app-verification', component: VerificationComponent },
      { path: 'google', redirectTo: 'google/callback' },
    ],
  },

  {
    path: '',
    component: LayoutUserComponent,
    children: [
      { path: '', component: Home },
      { path: 'houses', component: Houses },
      { path: 'upload-house', component: UploadHouse },
      { path: 'houses-search-results', component: HousesSearchResults },
      { path: 'bookmarks', component: Bookmarks },
      { path: 'notifications', component: Notifications },
    ],
  },

  {
    path: 'broker',
    component: BrokerLayoutComponent,
    children: [
      { path: 'upload-info', component: UploadBrokerInfo },
      { path: 'pending-houses', component: pendingHouses },
      { path: 'approved-houses', component: ApprovedHouses },
    ],
  },
];
