import { Component, OnInit, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms'; 
import { AdminService } from '../services/admin';
import { User } from '../../../core/Models/user';
import { AssignRole } from '../../../core/Models/Admin/assign-role';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-assign-role',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    MatSnackBarModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatTableModule
  ], 
  templateUrl: './assign-role.html',
  styleUrl: './assign-role.css'
})
export class AssignRoleComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar); 
  users: User[] = [];
  departments: any[] = [];
  loading = true;
  assignForm: FormGroup;
  selectedUser: User | null = null;
  roles = ['Admin', 'Citizen', 'DepartmentOfficer', 'SupervisoryOfficer'];
  searchTerm: string = '';

  //Material Table Configuration
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['id', 'fullName', 'email', 'role', 'department', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.assignForm = this.fb.group({
      userId: [0, Validators.required],
      roleName: ['', Validators.required],
      departmentId: [null]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadDepartments();
  }

  //Search functionality
  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadDepartments() {
    this.adminService.getAllDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching departments', err);
        this.snackBar.open('Error: Could not load department list.', 'Close', { duration: 3000 });
      }
    });
  }

  loadUsers() {
    this.loading = true;
    this.cdr.markForCheck();

    this.adminService.getAllUsers().subscribe({
      next: (res: User[]) => {
        
        this.users = res.sort((a, b) => b.id - a.id);
        this.dataSource.data = this.users;
        
        // Custom filter predicate to search nested role names
        this.dataSource.filterPredicate = (data, filter) => {
          const searchStr = `${data.id} ${data.fullName} ${data.email} ${data.role.name} ${data.department?.name || ''}`.toLowerCase();
          return searchStr.includes(filter);
        };

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch(property) {
              case 'role': return item.role.name;
              case 'department': return item.department?.name || '';
              default: return (item as any)[property];
            }
          };

          this.loading = false;
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  openAssignForm(user: User) {
    this.selectedUser = user;
    this.assignForm.patchValue({
      userId: user.id,
      roleName: user.role?.name || '',
      departmentId: user.departmentId || null 
    });
    this.cdr.markForCheck();
  }

  onSubmit() {
    if (this.assignForm.valid) {
      const formValue = this.assignForm.value;
      const payload: AssignRole = {
        userId: formValue.userId,
        roleName: formValue.roleName,
        departmentId: (formValue.roleName !== 'DepartmentOfficer' || !formValue.departmentId || formValue.departmentId === 0) 
                      ? null 
                      : formValue.departmentId
      };

      this.adminService.assignRole(payload).subscribe({
        next: () => {
          this.snackBar.open('Success: Role assigned successfully!', 'Close', {
            duration: 4000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'right'
          });
          this.selectedUser = null;
          this.loadUsers();
        },
        error: (err) => {
          this.snackBar.open('Error: Failed to assign role.', 'Retry', { duration: 5000 });
        }
      });
    }
  }

  cancel() { 
    this.selectedUser = null; 
    this.cdr.markForCheck();
  }
}