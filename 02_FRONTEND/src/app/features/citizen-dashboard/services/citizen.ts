import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grievance } from '../../../core/Models/Grievance/grievance';
import { GrievanceCreate } from '../../../core/Models/Grievance/grievance-create';
import { Category } from '../../../core/Models/category';

@Injectable({ providedIn: 'root' })
export class CitizenService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5213/api'; 

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/public/categories`, { 
      headers: this.getHeaders() 
    });
  }

  lodgeGrievance(data: GrievanceCreate): Observable<any> {
    return this.http.post(`${this.baseUrl}/grievances`, data, { 
      headers: this.getHeaders() 
    });
  }

  
  getMyGrievances(): Observable<Grievance[]> {
    return this.http.get<Grievance[]>(`${this.baseUrl}/grievances/my`, { 
      headers: this.getHeaders() 
    });
  }

  escalateGrievance(id: number): Observable<any> {
    
    return this.http.put(`${this.baseUrl}/grievances/${id}/escalate`, {}, { 
      headers: this.getHeaders() 
    });
  }
  reopenGrievance(id: number, reason: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/grievances/${id}/reopen`, { reason }, { 
    headers: this.getHeaders() 
  });
}
closeGrievance(id: number, feedback: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/grievances/${id}/close`, { feedback }, { 
    headers: this.getHeaders() 
  });
}
}