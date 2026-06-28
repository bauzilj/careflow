import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard')
            .then(m => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users/users')
            .then(m => m.UsersComponent),
      },
      {
        path: 'doctors',
        loadComponent: () =>
          import('./features/doctors/doctors/doctors')
            .then(m => m.DoctorsComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ]
  }
];