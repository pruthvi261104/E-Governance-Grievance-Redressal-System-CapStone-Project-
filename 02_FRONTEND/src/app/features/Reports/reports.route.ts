import { Routes } from '@angular/router';
import { ReportLayout } from './report-layout/report-layout';
import { StatusSummary } from './status-summary/status-summary';
import { DepartmentPerformance } from './department-performance/department-performance';
import { CategoryReport } from './category/category';
import { Department } from './department/department';

export const REPORT_ROUTES: Routes = [
  {
    path: '',
    component: ReportLayout,
    children: [
      { 
        path: 'status-summary', 
        component: StatusSummary, 
        title: 'Status Overview' 
      },
      { 
        path: 'performance', 
        component: DepartmentPerformance, 
        title: 'Performance Analytics' 
      },
      { 
        path: 'categories', 
        component: CategoryReport, 
        title: 'Category Reports' 
      },
      { 
        path: 'departments', 
        component: Department, 
        title: 'Departmental Breakdown' 
      },
      { path: '', redirectTo: 'status-summary', pathMatch: 'full' }
    ]
  }
];