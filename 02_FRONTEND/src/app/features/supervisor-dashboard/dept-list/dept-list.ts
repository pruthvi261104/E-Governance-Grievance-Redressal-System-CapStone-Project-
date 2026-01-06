import { Component, OnInit, inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupervisorService } from '../services/supervisor';
import { GrievanceResponse } from '../../../core/Models/Grievance/grievance-response';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dept-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, MatPaginatorModule, MatSortModule, MatTableModule],
  templateUrl: './dept-list.html',
  styleUrl: './dept-list.css'
})
export class DeptList implements OnInit {
  private supervisorService = inject(SupervisorService);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  allGrievances: GrievanceResponse[] = [];
  filteredGrievances: GrievanceResponse[] = [];
  allOfficers: any[] = []; 
  selectedOfficers: { [key: number]: string } = {}; 
  
  searchTerm: string = '';
  selectedStatus: string = 'All';
  isLoading: boolean = false;

  dataSource = new MatTableDataSource<GrievanceResponse>([]);
  displayedColumns: string[] = ['grievanceId', 'details', 'status', 'assignedOfficerName', 'assignAction'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadDepartmentData();
    this.loadOfficers();
  }

  loadDepartmentData() {
    this.isLoading = true;
    this.cdr.markForCheck(); //Safe notification of state change

    this.supervisorService.getAllGrievances().subscribe({
      next: (data) => {
        // Logic remains same: Pin Escalated to top
        this.allGrievances = data.sort((a, b) => {
          if (a.status === 'Escalated' && b.status !== 'Escalated') return -1;
          if (a.status !== 'Escalated' && b.status === 'Escalated') return 1;
          return 0;
        });
        
        this.applyFilters();
        
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.markForCheck(); //Safe notification
        }, 0);
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadOfficers() {
    this.supervisorService.getDepartmentOfficers().subscribe({
      next: (data) => {
        this.allOfficers = data; 
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error loading officers:', err)
    });
  }
  
  getOfficersByDepartment(deptName: string) {
    return this.allOfficers.filter(officer => officer.department?.name === deptName);
  }

  onAssign(grievanceId: number) {
    const officerId = Number(this.selectedOfficers[grievanceId]);
    if (!officerId) return;

    this.isLoading = true;
    this.cdr.markForCheck();

    this.supervisorService.assignOfficer(grievanceId, officerId).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.isLoading = false;
          this.snackBar.open(response || 'Assigned successfully', 'Close', { 
            duration: 3000, 
            panelClass: ['success-snackbar'] 
          });
          delete this.selectedOfficers[grievanceId];
          this.loadDepartmentData(); 
        }, 0);
      }
    });
  }

  applyFilters() {
    //Filter based on inputs
    let filtered = this.allGrievances.filter(g => {
      const matchesSearch = g.title.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                            g.grievanceId.toString().includes(this.searchTerm);
      const matchesStatus = this.selectedStatus === 'All' || g.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });

    // Logic remains same: Sort by latest first
    this.filteredGrievances = filtered.sort((a, b) => b.grievanceId - a.grievanceId);

    //Update existing data property
    this.dataSource.data = this.filteredGrievances;
    
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'details': return item.title;
          default: return (item as any)[property];
        }
      };

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.cdr.markForCheck();
    });

    this.filteredGrievances.forEach(g => {
      if (!this.selectedOfficers[g.grievanceId]) {
        this.selectedOfficers[g.grievanceId] = ""; 
      }
    });
  }
}

