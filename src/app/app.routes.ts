import { Routes } from '@angular/router';
import { PolicyList } from './page/list/policy-list';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'expiring'
  },
  {
    path: 'expiring',
    component: PolicyList
  }
];
