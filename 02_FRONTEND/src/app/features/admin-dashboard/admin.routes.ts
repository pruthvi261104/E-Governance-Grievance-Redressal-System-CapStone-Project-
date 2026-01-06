import { Routes } from '@angular/router';

import { AdminLayout } from './admin-layout/admin-layout';
import { UsersComponent } from './users/users';
import { AssignRoleComponent } from './assign-role/assign-role';
import { AddDepartment } from './add-department/add-department';
import { AddCategory } from './add-category/add-category';

import { roleGuard } from '../../core/auth/role-guard';
import { AddRole } from './add-role/add-role';
export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayout,
    canActivate: [roleGuard],
    data: { role: 'Admin' },
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'assign-role',
        component: AssignRoleComponent,
      },
      {
        path: 'add-department',
        component: AddDepartment
      },
      {
        path: 'add-category',
        component: AddCategory
      },
      {
        path: 'add-role',
        component: AddRole,
      },
      
    ]
  }
];
