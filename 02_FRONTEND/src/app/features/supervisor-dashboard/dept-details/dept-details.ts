import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupervisorService } from '../services/supervisor';

@Component({
  selector: 'app-dept-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dept-details.html',
  styleUrl: './dept-details.css',
})
export class DeptDetails implements OnInit {
  private supervisorService = inject(SupervisorService);
  private cdr = inject(ChangeDetectorRef);

  officerList: any[] = [];
  filteredList: any[] = [];
  
  // List of unique departments for the dropdown
  departments: string[] = [];
  selectedDepartment: string = 'All'; // Default selection
  isLoading = false;

  ngOnInit(): void {
    this.fetchOfficers();
  }

  fetchOfficers() {
    this.isLoading = true;
    this.supervisorService.getDepartmentOfficers().subscribe({
      next: (data) => {
        this.officerList = data;
        this.filteredList = data;
        
        // Extract unique department names for the dropdown
        this.departments = [...new Set(data.map(o => o.department?.name || 'Unassigned'))];
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  //Updated Filter Logic for Dropdown
  onFilterChange() {
    if (this.selectedDepartment === 'All') {
      this.filteredList = this.officerList;
    } else {
      this.filteredList = this.officerList.filter(o => 
        (o.department?.name || 'Unassigned') === this.selectedDepartment
      );
    }
  }
}