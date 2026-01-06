import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dept-officer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dept-officer-layout.html',
  styleUrl: './dept-officer-layout.css'
})
export class DeptOfficerLayout {
  private router = inject(Router);

  onLogout() {
    // Clear tokens/session logic here
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}