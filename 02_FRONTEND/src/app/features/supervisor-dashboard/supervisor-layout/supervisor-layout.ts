import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-supervisor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supervisor-layout.html',
  styleUrl: './supervisor-layout.css'
})
export class SupervisorLayout {
  private router = inject(Router);

  onLogout() {
    // Session cleanup logic
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}