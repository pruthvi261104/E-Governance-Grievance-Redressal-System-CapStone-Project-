import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../services/report';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-status-summary',
  standalone: true,
  imports: [CommonModule],
  template: '<canvas id="statusChart"></canvas>',
  styles: [':host { display: block; height: 400px; width: 400px; margin: auto; }']
})
export class StatusSummary implements OnInit {
  private reportService = inject(ReportService);

  ngOnInit() {
    this.reportService.getStatusSummary().subscribe(data => {
      new Chart('statusChart', {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.status),
          datasets: [{
            data: data.map(d => d.count),
            backgroundColor: ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#94a3b8']
          }]
        },
        options: { responsive: true, plugins: { title: { display: true, text: 'Grievance Status Distribution' }}}
      });
    });
  }
}