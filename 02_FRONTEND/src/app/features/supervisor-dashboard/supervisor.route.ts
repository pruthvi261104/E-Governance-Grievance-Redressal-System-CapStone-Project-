import { Routes } from '@angular/router';
import { SupervisorLayout } from './supervisor-layout/supervisor-layout';
import { DeptList } from './dept-list/dept-list';
import { DeptDetails } from './dept-details/dept-details';
import { roleGuard } from '../../core/auth/role-guard';
import { CloseGrievance } from './close-grievance/close-grievance';
export const SUPERVISOR_ROUTES: Routes = [
  {
    path: '',
    component: SupervisorLayout,
    canActivate: [roleGuard],
    data: { role: 'SupervisoryOfficer' }, 
    children: [
      { 
        path: 'dept-list', 
        component: DeptList, 
        title: 'Department Overview' 
      },
      { 
        path: 'dept-details', 
        component: DeptDetails, 
        title: 'DepartmentDetails' 
      },
      { 
        path: 'close-grievance', 
        component: CloseGrievance, 
        title: 'Final Case Closure' 
      },
      {
        path: 'reports',
        loadChildren: () => import('../Reports/reports.route').then(m => m.REPORT_ROUTES)
      },
      { 
        path: '', 
        redirectTo: 'dept-list', 
        pathMatch: 'full' 
      }
    ]
  }
];