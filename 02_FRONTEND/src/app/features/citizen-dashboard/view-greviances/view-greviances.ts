import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { CitizenService } from '../services/citizen';
import { Grievance } from '../../../core/Models/Grievance/grievance';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-view-grievances',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, MatSortModule, MatTableModule], 
  templateUrl: './view-greviances.html',
  styleUrl: './view-greviances.css'
})
export class ViewGrievances implements OnInit {
  private citizenService = inject(CitizenService);
  private cdr = inject(ChangeDetectorRef);
  
  grievances: Grievance[] = [];
  isLoading = true;
  searchTerm: string = ''; 

  dataSource = new MatTableDataSource<Grievance>([]);
  displayedColumns: string[] = ['grievanceId', 'title', 'status', 'assignedOfficerName', 'createdAt'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadMyGrievances();
  }

  loadMyGrievances() {
    this.isLoading = true;
    this.citizenService.getMyGrievances().subscribe({
      next: (data) => {
        this.grievances = data.sort((a, b) => b.grievanceId - a.grievanceId);
        this.dataSource.data = this.grievances; 

        this.dataSource.filterPredicate = (data, filter) => {
          const searchStr = `${data.grievanceId} ${data.title} ${data.status} ${data.assignedOfficerName || ''}`.toLowerCase();
          return searchStr.includes(filter);
        };

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ Search functionality
  applyFilter() {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reset to page 1 on search
    }
  }

  getStatusClass(status: string): string {
    if (!status) return 'status-default';
    return `status-${status.toLowerCase()}`;
  }
}