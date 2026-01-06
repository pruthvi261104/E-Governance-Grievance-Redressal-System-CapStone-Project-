import { Component, inject } from '@angular/core';
import { Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth/auth';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
    CommonModule,
     MatSnackBarModule, 
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  form = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: this.passwordMatchValidator
  });

  passwordMatchValidator(group: any) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }
private snackBar = inject(MatSnackBar);
  submit() {
  if (this.form.invalid) return;

  this.auth.register(this.form.value as any).subscribe({
    next: () => {
      this.snackBar.open('Registration successful!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.router.navigate(['/login']);
    },
    error: (err) => {
      const message =
        err?.error?.message || 'Registration failed';

      this.snackBar.open(message, 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
    }
  });
}

}
