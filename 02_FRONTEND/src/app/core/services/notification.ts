import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin,Subject } from 'rxjs';
import { Notification } from '../Models/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:5213/api/notifications';
  private refreshNeeded = new Subject<void>();
  refreshNeeded$ = this.refreshNeeded.asObservable();
  constructor(private http: HttpClient) {}
  triggerRefresh() {
    this.refreshNeeded.next();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  markAsRead(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/mark-as-read`, {}, { headers: this.getHeaders() });
  }
  markAllAsRead(notifications: Notification[]): Observable<any[]> {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const requests = unreadNotifications.map(n => this.markAsRead(n.id));
    return forkJoin(requests);
  }
}