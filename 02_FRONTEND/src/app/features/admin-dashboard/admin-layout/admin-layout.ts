import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
private router = inject(Router);

  onLogout() {
    // 1. Remove the token from local storage
    localStorage.removeItem('token');
    
    // 2. Clear any other user-related data if exists
    // localStorage.clear(); 

    // 3. Navigate back to login page
    this.router.navigate(['/login']);
}
}
