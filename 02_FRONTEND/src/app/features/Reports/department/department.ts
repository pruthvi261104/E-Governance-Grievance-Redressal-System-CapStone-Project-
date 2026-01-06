import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../services/report';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department.html',
  styleUrl: './department.css',
})
export class Department implements OnInit {
  private reportService = inject(ReportService);
  
  @ViewChild('deptChart') private chartRef!: ElementRef;
  chart: any;

  ngOnInit(): void {
    this.loadDepartmentData();
  }

  loadDepartmentData() {
    this.reportService.getGrievancesByDepartment().subscribe({
      next: (data) => {
        const labels = data.map(d => d.departmentName);
        const counts = data.map(d => d.count);
        this.createChart(labels, counts);
      },
      error: (err) => console.error('Error fetching department reports', err)
    });
  }

  createChart(labels: string[], counts: number[]) {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar', // Horizontal bar via indexAxis option
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Grievances',
          data: counts,
          backgroundColor: [
            '#1a3a3a', // Supervisor Teal
            '#2d5a5a', 
            '#407a7a', 
            '#539a9a', 
            '#66baba'
          ],
          borderRadius: 6,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Makes the bar chart horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Grievance Volume by Department',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          x: { beginAtZero: true, grid: { display: false } },
          y: { grid: { display: false } }
        }
      }
    });
  }
}