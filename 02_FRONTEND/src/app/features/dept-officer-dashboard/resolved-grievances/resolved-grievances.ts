import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { DeptOfficerService } from '../services/dept-officer';
import { Auth } from '../../../core/auth/auth';
import { GrievanceResponse } from '../../../core/Models/Grievance/grievance-response';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-resolved-grievances',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, //Necessary for ngModel
    MatPaginatorModule, 
    MatSortModule, 
    MatTableModule
  ],
  templateUrl: './resolved-grievances.html',
  styleUrl: './resolved-grievances.css'
})
export class ResolvedGrievances implements OnInit {
  private officerService = inject(DeptOfficerService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  resolvedList: GrievanceResponse[] = [];
  isLoading = false;
  searchTerm: string = ''; //Track search input

  dataSource = new MatTableDataSource<GrievanceResponse>([]);
  displayedColumns: string[] = ['grievanceId', 'details', 'categoryName', 'status'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadResolvedHistory();
  }

  //Search Functionality
  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadResolvedHistory() {
    this.isLoading = true;
    this.officerService.getDepartmentGrievances().subscribe({
      next: (data) => {
        const myName = this.auth.getUserName();
        const filtered = data.filter(g => 
          g.assignedOfficerName === myName && 
          (g.status === 'Resolved' || g.status === 'Closed')
        );
        this.resolvedList = filtered.sort((a, b) => b.grievanceId - a.grievanceId);
        
        this.dataSource.data = this.resolvedList;

        this.dataSource.filterPredicate = (data, filter) => {
          const searchStr = `${data.grievanceId} ${data.title} ${data.categoryName}`.toLowerCase();
          return searchStr.includes(filter);
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