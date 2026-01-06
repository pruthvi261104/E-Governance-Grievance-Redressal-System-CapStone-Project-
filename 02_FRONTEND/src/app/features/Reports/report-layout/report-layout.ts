import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-report-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './report-layout.html',
  styleUrl: './report-layout.css',
})
export class ReportLayout {
  reportTabs = [
    { 
      label: 'Status Summary', 
      path: 'status-summary', 
      icon: '📊' 
    },
    { 
      label: 'Performance Metrics', 
      path: 'performance', 
      icon: '📈' 
    },
    { 
      label: 'Category Wise', 
      path: 'categories', 
      icon: '📁' 
    },
    { 
      label: 'Department Wise', 
      path: 'departments', 
      icon: '🏢' 
    }
  ];
  onExportCurrentReport() {
    window.print();
  }
}