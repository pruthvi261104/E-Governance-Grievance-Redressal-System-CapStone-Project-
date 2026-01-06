import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-add-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './add-role.html',
  styleUrl: './add-role.css'
})
export class AddRole implements OnInit {
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  roleForm: FormGroup;
  roles: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'name'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showToast = false;
  toastMessage = '';

  constructor() {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.adminService.getRoles().subscribe({
      next: (res) => {
        this.roles = res;
        this.dataSource = new MatTableDataSource(this.roles);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching roles', err)
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      this.adminService.addRole(this.roleForm.value).subscribe({
        next: () => {
          this.triggerToast('Role added successfully!');
          this.roleForm.reset();
          this.loadRoles(); // Refresh data source
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Error adding role';
          this.triggerToast(errorMsg, true);
        }
      });
    }
  }

  triggerToast(msg: string, isError = false) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => { 
      this.showToast = false; 
      this.cdr.detectChanges(); 
    }, 3000);
  }
}