import { Routes } from '@angular/router';
import { PolicyList } from './feature/list/policy-list';
import { Login } from './feature/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'expiring'
  },
  {
    path: 'expiring',
    component: PolicyList,
    canActivate: [authGuard]
  }
];
