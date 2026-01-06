import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../services/admin';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatPaginatorModule, MatSortModule, MatTableModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css'
})
export class AddCategory implements OnInit {
  private adminService = inject(AdminService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  categoryForm: FormGroup;
  departments: any[] = [];
  categories: any[] = [];
  
  //New Material Table properties
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'name', 'department'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  showToast = false;
  toastMessage = '';

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      departmentId: ['', Validators.required] 
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.adminService.getAllDepartments().subscribe(res => {
      this.departments = res;
      this.cdr.detectChanges();
    });

    this.adminService.getCategories().subscribe(res => {
      this.categories = res;
      
      //Initialize Data Source with existing categories logic
      this.dataSource = new MatTableDataSource(this.categories);

      //Define custom sorting for the nested department name
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'department': return item.department?.name;
          default: return item[property];
        }
      };

      //Link Paginator and Sort
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

      this.cdr.detectChanges();
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.adminService.addCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.triggerToast('Category added successfully!');
          this.categoryForm.reset({ departmentId: '' });
          this.loadInitialData();
        },
        error: () => this.triggerToast('Error adding category', true)
      });
    }
  }

  triggerToast(msg: string, isError = false) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; this.cdr.detectChanges(); }, 3000);
  }
}