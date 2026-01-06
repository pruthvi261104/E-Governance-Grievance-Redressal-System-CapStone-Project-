import { Component, OnInit, inject, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../services/report';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class CategoryReport implements OnInit {
  private reportService = inject(ReportService);
  
  @ViewChild('categoryChart') private chartRef!: ElementRef;
  chart: any;

  ngOnInit(): void {
    this.loadCategoryData();
  }

  loadCategoryData() {
    this.reportService.getGrievancesByCategory().subscribe({
      next: (data) => {
        const labels = data.map(d => d.categoryName);
        const counts = data.map(d => d.count);
        this.createChart(labels, counts);
      },
      error: (err) => console.error('Error loading category reports', err)
    });
  }

  createChart(labels: string[], counts: number[]) {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total Grievances',
          data: counts,
          backgroundColor: '#1a3a3a', // Your Supervisor Teal theme
          borderRadius: 5,
          hoverBackgroundColor: '#2d5a5a'
        }]
      },
      options: {
        indexAxis: 'y', // Makes it horizontal
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Grievances by Specific Category',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          x: { beginAtZero: true, grid: { color: '#f1f5f9' } },
          y: { grid: { display: false } }
        }
      }
    });
  }
}