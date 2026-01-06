import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../core/Models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5213/api/admin';

  constructor() {}

  // =========================
  // GET ALL USERS
  // =========================
  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
    
    // Manual header addition to guarantee the 401 goes away
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log('AdminService: Fetching users with token:', token ? 'Token Found' : 'No Token');

    return this.http.get<User[]>(`${this.baseUrl}/users`, { headers });
  }

  getAllDepartments(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<any[]>(`${this.baseUrl}/departments`, { headers });
}

  // =========================
  // ASSIGN ROLE
  // =========================
  assignRole(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put(`${this.baseUrl}/assign-role`, data, { headers });
  }

  // =========================
  // ADD DEPARTMENT
  // =========================
  addDepartment(data: { name: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/department`, data, { headers });
  }
  getCategories(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<any[]>(`${this.baseUrl}/categories`, { headers });
}

  // =========================
  // ADD CATEGORY
  // =========================
  addCategory(data: { name: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/category`, data, { headers });
  }
getRoles(): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<any[]>(`${this.baseUrl}/roles`, { headers });
}
  // =========================
  // ADD ROLE
  // =========================
  addRole(data: { name: string }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/role`, data, { headers });
  }
}