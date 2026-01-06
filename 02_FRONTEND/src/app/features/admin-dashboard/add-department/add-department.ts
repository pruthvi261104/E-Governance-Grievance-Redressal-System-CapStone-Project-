import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-add-department',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatPaginatorModule, MatSortModule, MatTableModule],
  templateUrl: './add-department.html',
  styleUrl: './add-department.css'
})
export class AddDepartment implements OnInit {
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  deptForm: FormGroup;
  departments: any[] = [];
  
 
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'name'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Toast properties
  toastMessage: string = '';
  showToast: boolean = false;

  constructor() {
    this.deptForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.adminService.getAllDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        
        
        this.dataSource = new MatTableDataSource(this.departments);
        
        
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.deptForm.valid) {
      this.adminService.addDepartment(this.deptForm.value).subscribe({
        next: () => {
          this.triggerToast('Department created successfully!');
          this.deptForm.reset();
          this.loadDepartments(); // Refresh table data
        },
        error: () => this.triggerToast('Error creating department', true)
      });
    }
  }

  triggerToast(message: string, isError: boolean = false) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}