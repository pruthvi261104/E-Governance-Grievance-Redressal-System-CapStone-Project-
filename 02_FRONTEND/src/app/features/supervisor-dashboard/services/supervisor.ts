import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrievanceResponse } from '../../../core/Models/Grievance/grievance-response';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5213/api/grievances';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  //Fetch all grievances for supervisor overview
  getAllGrievances(): Observable<GrievanceResponse[]> {
    return this.http.get<GrievanceResponse[]>(`${this.baseUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  //Fetch only escalated grievances for the supervisor
  getEscalatedGrievances(): Observable<GrievanceResponse[]> {
    return this.http.get<GrievanceResponse[]>(`${this.baseUrl}/escalated`, {
      headers: this.getHeaders()
    });
  }

  //Assign or Reassign a grievance to an officer
  assignOfficer(id: number, officerUserId: number): Observable<string> {
    return this.http.put(`${this.baseUrl}/${id}/assign`, { officerUserId }, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  //Fetch officers from the public endpoint
  getDepartmentOfficers(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5213/api/public/officers`, {
      headers: this.getHeaders()
    });
  }
  // supervisor.service.ts
closeGrievance(id: number, feedback: string): Observable<any> {
  // Mapping to PUT api/grievances/{id}/close
  return this.http.put(`${this.baseUrl}/${id}/close`, { feedback }, {
    headers: this.getHeaders(),
    responseType: 'text' 
  });
}


}