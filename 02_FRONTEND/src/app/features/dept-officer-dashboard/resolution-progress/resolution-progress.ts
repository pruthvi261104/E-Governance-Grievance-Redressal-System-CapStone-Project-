import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeptOfficerService } from '../services/dept-officer';
import { Auth } from '../../../core/auth/auth';
import { GrievanceResponse } from '../../../core/Models/Grievance/grievance-response';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resolution-progress',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatSnackBarModule, 
    MatPaginatorModule, 
    MatSortModule, 
    MatTableModule
  ],
  templateUrl: './resolution-progress.html',
  styleUrl: './resolution-progress.css'
})
export class ResolutionProgress implements OnInit {
  private officerService = inject(DeptOfficerService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Component State
  myGrievances: GrievanceResponse[] = [];
  isLoading = false;
  searchTerm: string = ''; 
  
  // Custom Modal State
  showRemarkModal = false;
  tempGrievanceId: number | null = null;
  customRemark: string = '';

  // Table Configuration
  dataSource = new MatTableDataSource<GrievanceResponse>([]);
  displayedColumns: string[] = ['grievanceId', 'details', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadMyWork();
  }

  loadMyWork() {
    this.isLoading = true;
    this.cdr.markForCheck(); 

    this.officerService.getDepartmentGrievances().subscribe({
      next: (data) => {
        const myName = this.auth.getUserName();
        this.myGrievances = data.filter(g => 
          g.assignedOfficerName === myName && 
          (g.status === 'Assigned' || g.status === 'InReview')
        );

        this.dataSource.data = this.myGrievances;

        this.dataSource.filterPredicate = (data, filter) => {
          const searchStr = `${data.grievanceId} ${data.title} ${data.status}`.toLowerCase();
          return searchStr.includes(filter);
        };

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
          this.cdr.markForCheck(); 
        });
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onAction(grievanceId: number, actionType: 'InReview' | 'Resolved') {
    if (actionType === 'Resolved') {
      this.tempGrievanceId = grievanceId;
      this.customRemark = ''; 
      this.showRemarkModal = true;
      this.cdr.markForCheck();
    } else {
      this.executeAction(grievanceId, 'InReview', 'Grievance is now under active investigation.');
    }
  }
  confirmResolution() {
    if (this.tempGrievanceId) {
      const finalRemark = this.customRemark.trim() || 'The reported issue has been successfully addressed.';
      this.executeAction(this.tempGrievanceId, 'Resolved', finalRemark);
      this.closeModal();
    }
  }

  closeModal() {
    this.showRemarkModal = false;
    this.tempGrievanceId = null;
    this.cdr.markForCheck();
  }

  private executeAction(grievanceId: number, actionType: 'InReview' | 'Resolved', remark: string) {
    const action$ = actionType === 'InReview' 
      ? this.officerService.markInReview(grievanceId, remark) 
      : this.officerService.resolveGrievance(grievanceId, remark);

    this.isLoading = true;
    this.cdr.markForCheck();

    action$.subscribe({
      next: (response: string) => {
        this.snackBar.open(response, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
        
        if (actionType === 'Resolved') {
          this.router.navigate(['/dept-officer/resolved']); 
        } else {
          this.loadMyWork();
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open("Update failed: " + err.message, "Close", { duration: 4000 });
        this.cdr.markForCheck();
      }
    });
  }
}