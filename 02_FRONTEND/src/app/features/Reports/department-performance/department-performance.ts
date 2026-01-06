import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../services/report';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-department-performance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-performance.html',
  styleUrl: './department-performance.css'
})
export class DepartmentPerformance implements OnInit {
  private reportService = inject(ReportService);
  
  @ViewChild('perfChart') private chartRef!: ElementRef;
  chart: any;

  ngOnInit() {
    this.reportService.getDepartmentPerformance().subscribe(data => {
      this.chart = new Chart(this.chartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: data.map(d => d.departmentName),
          datasets: [
            { 
              label: 'Resolved', 
              data: data.map(d => d.resolvedGrievances), 
              backgroundColor: '#10b981', // Success Green
              borderRadius: 4
            },
            { 
              label: 'Pending', 
              data: data.map(d => d.pendingGrievances), 
              backgroundColor: '#f59e0b', // Warning Orange
              borderRadius: 4
            }
          ]
        },
        options: { 
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            tooltip: { 
              callbacks: { 
                footer: (items) => {
                  const val = data[items[0].dataIndex].averageResolutionHours;
                  return `Avg Resolution: ${val.toFixed(2)} hrs`;
                }
              }
            }
          },
          scales: { 
            x: { stacked: true, grid: { display: false } }, 
            y: { stacked: true, beginAtZero: true } 
          }
        }
      });
    });
  }
}