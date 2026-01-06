import { Routes } from '@angular/router';
import { CitizenLayout } from './citizen-layout/citizen-layout';
import { LodgeGrievance } from './lodge-grievance/lodge-grievance';
import { ViewGrievances } from './view-greviances/view-greviances';
import { EscalateGrievance } from './escalate-grievance/escalate-grievance';
import { CloseGrievance } from '../supervisor-dashboard/close-grievance/close-grievance';
import { roleGuard } from '../../core/auth/role-guard';

export const CITIZEN_ROUTES: Routes = [
  {
    path: '',
    component: CitizenLayout,
    canActivate: [roleGuard],
    data: { role: 'Citizen' },
    children: [
      { path: 'lodge-grievance', component: LodgeGrievance },
      { path: 'view-grievances', component: ViewGrievances },
      { path: 'escalate', component: EscalateGrievance },
      { path: 'close', component: CloseGrievance },
      { path: '', redirectTo: 'view-grievances', pathMatch: 'full' },
    ],
  },
];
