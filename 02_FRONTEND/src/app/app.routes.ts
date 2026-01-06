import { Routes } from '@angular/router';
import { roleGuard } from './core/auth/role-guard';

import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Admin Dashboard
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin-dashboard/admin.routes')
        .then(m => m.adminRoutes)
  },

  // Citizen Dashboard
  {
    path: 'citizen',
    loadChildren: () => 
      import('./features/citizen-dashboard/citizen.route')
        .then(m => m.CITIZEN_ROUTES) 
  },

  // Department Officer Dashboard
  {
    path: 'dept-officer',
    loadChildren: () => 
      import('./features/dept-officer-dashboard/dept-officer.route')
        .then(m => m.OFFICER_ROUTES) // This contains the list, progress, and status routes
  },
  {
    path: 'supervisor',
    loadChildren: () => 
      import('./features/supervisor-dashboard/supervisor.route') // Path to your new routes file
        .then(m => m.SUPERVISOR_ROUTES)
  },
  { path: '**', redirectTo: 'login' }
];