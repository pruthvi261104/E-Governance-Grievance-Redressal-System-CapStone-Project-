import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { 
//   CategoryReport, 
//   DepartmentReport, 
//   PerformanceReport, 
//   StatusReport 
// } from '../../core/Models/Reports_interfaces/report_interface';
import { CategoryReport,DepartmentReport,PerformanceReport,StatusReport}  from '../../../core/Models/Reports_interfaces/report_interface';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5213/api/reports';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // 1. Grievances by Category
  getGrievancesByCategory(): Observable<CategoryReport[]> {
    return this.http.get<CategoryReport[]>(`${this.baseUrl}/grievances-by-category`, {
      headers: this.getHeaders()
    });
  }

  // 2. Grievances by Department
  getGrievancesByDepartment(): Observable<DepartmentReport[]> {
    return this.http.get<DepartmentReport[]>(`${this.baseUrl}/grievances-by-department`, {
      headers: this.getHeaders()
    });
  }

  // 3. Department Performance
  getDepartmentPerformance(): Observable<PerformanceReport[]> {
    return this.http.get<PerformanceReport[]>(`${this.baseUrl}/department-performance`, {
      headers: this.getHeaders()
    });
  }

  // 4. Status Summary
  getStatusSummary(): Observable<StatusReport[]> {
    return this.http.get<StatusReport[]>(`${this.baseUrl}/status-summary`, {
      headers: this.getHeaders()
    });
  }
}