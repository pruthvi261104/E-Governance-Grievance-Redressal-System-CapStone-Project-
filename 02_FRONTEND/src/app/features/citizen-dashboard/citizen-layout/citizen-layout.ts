import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NotificationBellComponent } from '../../../shared/notification-bell/notification-bell';

@Component({
  selector: 'app-citizen-layout',
  standalone: true,
  imports: [CommonModule, RouterModule,NotificationBellComponent],
  templateUrl: './citizen-layout.html',
  styleUrl: './citizen-layout.css'
})
export class CitizenLayout {
  private router = inject(Router);
  onLogout() {
    // 1. Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // 2. Redirect to login page
    this.router.navigate(['/login']);
  }
}