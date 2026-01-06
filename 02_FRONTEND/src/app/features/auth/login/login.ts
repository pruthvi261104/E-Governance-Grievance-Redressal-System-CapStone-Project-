import { Component, inject } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  hidePassword = true;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        const role = this.auth.getUserRole();
        
        this.snackBar.open('Login Successful!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        setTimeout(() => {
          this.redirectUser(role);
        }, 0);
      },
      error: (err) => {
        this.snackBar.open('Invalid credentials. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private redirectUser(role: string | null) {
    switch (role) {
      case 'Admin': this.router.navigate(['/admin']); break;
      case 'Citizen': this.router.navigate(['/citizen']); break;
      case 'DepartmentOfficer': this.router.navigate(['/dept-officer']); break;
      case 'SupervisoryOfficer': this.router.navigate(['/supervisor']); break;
      default:
        this.router.navigate(['/login']);
    }
  }
}