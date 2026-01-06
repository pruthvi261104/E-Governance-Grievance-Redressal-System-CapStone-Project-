import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin';
import { User } from '../../../core/Models/user';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatTableModule, 
    MatSlideToggleModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  loading = true;
  dataSource = new MatTableDataSource<User>([]);
  
  displayedColumns: string[] = ['id', 'fullName', 'email', 'role', 'department', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: User[]) => {
        this.users = res.sort((a, b) => b.id - a.id);
        
        this.dataSource = new MatTableDataSource(this.users);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'role': return item.role.name;
            case 'department': return item.department?.name || '';
            default: return (item as any)[property];
          }
        };

        this.dataSource.filterPredicate = (data, filter) => {
          const searchStr = `${data.fullName} ${data.email} ${data.role.name} ${data.department?.name || ''}`.toLowerCase();
          return searchStr.includes(filter);
        };

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onStatusChange(user: User) {
    console.log(`User ${user.fullName} status updated.`);
  }
}