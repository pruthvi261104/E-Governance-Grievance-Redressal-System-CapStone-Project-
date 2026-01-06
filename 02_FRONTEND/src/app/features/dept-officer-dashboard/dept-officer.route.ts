import { Routes } from '@angular/router';
import { DeptOfficerLayout } from './dept-officer-layout/dept-officer-layout';
import { GrievancesList } from './grievances-list/grievances-list';
import { ResolutionProgress } from './resolution-progress/resolution-progress';
import { ResolvedGrievances } from './resolved-grievances/resolved-grievances';
import { roleGuard } from '../../core/auth/role-guard';

export const OFFICER_ROUTES: Routes = [
  {
    path: '',
    component: DeptOfficerLayout,
    canActivate: [roleGuard],
    data: { role: 'DepartmentOfficer' }, 
    children: [
      { 
        path: 'grievances-list', 
        component: GrievancesList,
        title: 'Department Grievances' 
      },
      { 
        path: 'resolution-progress', 
        component: ResolutionProgress,
        title: 'My Active Reviews' 
      },
      { 
        path: 'resolved', 
        component: ResolvedGrievances,
        title: 'Resolved History' 
      },
      { path: '', redirectTo: 'grievances-list', pathMatch: 'full' }
    ]
  }
];