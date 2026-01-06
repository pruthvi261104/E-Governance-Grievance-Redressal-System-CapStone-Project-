import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SupervisorService } from '../services/supervisor';
import { GrievanceResponse } from '../../../core/Models/Grievance/grievance-response';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-close-grievance',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, MatSortModule, MatTableModule],
  templateUrl: './close-grievance.html',
  styleUrl: './close-grievance.css'
})
export class CloseGrievance implements OnInit {
  private supervisorService = inject(SupervisorService);
  private cdr = inject(ChangeDetectorRef);
  
  grievances: GrievanceResponse[] = [];
  isLoading = true;
  searchTerm: string = '';

  // Toast Properties
  showToast = false;
  toastMessage = '';
  isErrorToast = false;

  //New Modal & Feedback Properties
  showFeedbackModal = false;
  selectedGrievanceId: number | null = null;
  feedbackText: string = '';

  dataSource = new MatTableDataSource<GrievanceResponse>([]);
  displayedColumns: string[] = ['status', 'grievanceId', 'details', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadGrievancesForClosure();
  }

  //Filter Method for Search Bar
  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadGrievancesForClosure() {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.supervisorService.getAllGrievances().subscribe({
      next: (data) => {
        // Filter for Resolved cases and sort by ID Descending
        const filtered = data.filter(g => g.status === 'Resolved');
        this.grievances = filtered.sort((a, b) => b.grievanceId - a.grievanceId);
        
        this.dataSource.data = this.grievances;
        
        // Custom filter logic
        this.dataSource.filterPredicate = (data, filter) => {
          const searchStr = `${data.grievanceId} ${data.title} ${data.status}`.toLowerCase();
          return searchStr.includes(filter);
        };

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'details': return item.title;
              default: return (item as any)[property];
            }
          };

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

  
  openCloseModal(id: number) {
    this.selectedGrievanceId = id;
    this.feedbackText = ''; 
    this.showFeedbackModal = true;
    this.cdr.markForCheck();
  }

  
  closeModal() {
    this.showFeedbackModal = false;
    this.selectedGrievanceId = null;
    this.cdr.markForCheck();
  }

 
  onConfirmCloseWithFeedback() {
    if (this.selectedGrievanceId === null) return;

    // Use supervisor feedback or default automated remarks if empty
    const finalRemarks = this.feedbackText.trim() || "Grievance closed by Supervisor after final review.";
    
    this.supervisorService.closeGrievance(this.selectedGrievanceId, finalRemarks).subscribe({
      next: () => {
        this.handleSuccess(this.selectedGrievanceId!);
        this.closeModal();
      },
      error: (err) => {
        if (err.status === 200 || err.status === 204) {
          this.handleSuccess(this.selectedGrievanceId!);
          this.closeModal();
        } else {
          this.triggerToast(err.error || 'Unauthorized or failed to close case.', true);
        }
      }
    });
  }

  private handleSuccess(id: number) {
    this.triggerToast(`Grievance #${id} closed successfully.`, false);
    this.loadGrievancesForClosure(); 
  }

  triggerToast(msg: string, isError: boolean) {
    this.toastMessage = msg;
    this.isErrorToast = isError;
    this.showToast = true;
    this.cdr.markForCheck();

    setTimeout(() => { 
      this.showToast = false; 
      this.cdr.markForCheck(); 
    }, 3000);
  }
}