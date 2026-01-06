import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrievanceResponse, StatusUpdateDto } from './../../../core/Models/Grievance/grievance-response';

@Injectable({
  providedIn: 'root',
})
export class DeptOfficerService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5213/api/grievances';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDepartmentGrievances(): Observable<GrievanceResponse[]> {
    return this.http.get<GrievanceResponse[]>(`${this.baseUrl}/department`, {
      headers: this.getHeaders()
    });
  }

  

  markInReview(grievanceId: number, remarks: string): Observable<any> {
    const body: StatusUpdateDto = { remarks };
    return this.http.put(`${this.baseUrl}/${grievanceId}/in-review`, body, {
      headers: this.getHeaders(),
      responseType: 'text' //Handle text response
    });
  }

  resolveGrievance(grievanceId: number, remarks: string): Observable<any> {
    const body: StatusUpdateDto = { remarks };
    return this.http.put(`${this.baseUrl}/${grievanceId}/resolve`, body, {
      headers: this.getHeaders(),
      responseType: 'text' //Handle text response
    });
  }
}