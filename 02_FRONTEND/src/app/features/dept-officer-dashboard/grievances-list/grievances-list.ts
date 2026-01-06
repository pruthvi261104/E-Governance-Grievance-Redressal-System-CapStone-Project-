import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeptOfficerService } from '../services/dept-officer';
import { Auth } from '../../../core/auth/auth';
import { GrievanceResponse } from '../../../core/Models/Grievance/grievance-response';
import { Router } from '@angular/router'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 

@Component({
  selector: 'app-grievances-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatTableModule, 
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './grievances-list.html',
  styleUrl: './grievances-list.css'
})
export class GrievancesList implements OnInit {
  private officerService = inject(DeptOfficerService);
  private authService = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router); //Inject Router

  grievances: GrievanceResponse[] = [];
  isLoading = true;

  dataSource = new MatTableDataSource<GrievanceResponse>([]);
  displayedColumns: string[] = ['grievanceId', 'details', 'categoryName', 'status', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadAssignedGrievances();
  }

  //Filter Method for Search Bar
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  navigateToResolution() {
    this.router.navigate(['/dept-officer/resolution-progress']);
  }

  loadAssignedGrievances() {
    this.isLoading = true;
    const currentUserName = this.authService.getUserName();

    this.officerService.getDepartmentGrievances().subscribe({
      next: (data) => {
        this.grievances = data.filter(g => 
          g.assignedOfficerName === currentUserName && g.status === 'Assigned'
        );

        this.dataSource = new MatTableDataSource(this.grievances);

        // Custom sorting for nested details if needed
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'details': return item.title;
            default: return (item as any)[property];
          }
        };

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

