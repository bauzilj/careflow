import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/layouts/main-layout/main-layout';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [

  // Login (não protegido)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.LoginComponent),
  },

  // Área protegida
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],   // 👈 Protege todas as rotas filhas
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
        path: 'patients',
        loadComponent: () =>
          import('./features/patients/patients/patients')
            .then(m => m.PatientsComponent),
      },

      {
        path: 'appointments',
        loadComponent: () =>
          import('./features/appointments/appointments/appointments')
            .then(m => m.AppointmentsComponent),
      },

      {
        path: 'medical-records',
        loadComponent: () =>
          import('./features/medical-records/medical-records/medical-records')
            .then(m => m.MedicalRecordsComponent),
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];