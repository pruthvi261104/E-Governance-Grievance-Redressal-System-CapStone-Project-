import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitizenService } from '../services/citizen';
import { Grievance } from '../../../core/Models/Grievance/grievance';

@Component({
  selector: 'app-escalate-grievance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escalate-grievance.html',
  styleUrl: './escalate-grievance.css'
})
export class EscalateGrievance implements OnInit {
  private citizenService = inject(CitizenService);
  private cdr = inject(ChangeDetectorRef);
  
  grievances: Grievance[] = [];
  isLoading = true;
  showToast = false;
  toastMessage = '';
  isErrorToast = false;
  pendingEscalationId: number | null = null;

  ngOnInit(): void { this.loadGrievancesForEscalation(); }

  loadGrievancesForEscalation() {
    this.isLoading = true;
    this.citizenService.getMyGrievances().subscribe({
      next: (data) => {
        // Only allow escalation from 'Resolved' state
        this.grievances = data.filter(g => g.status === 'Resolved' && !g.isEscalated);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  onMarkEscalation(id: number) {
    this.citizenService.escalateGrievance(id).subscribe({
      next: () => this.handleSuccess(id),
      error: (err) => {
        if (err.status === 200 || err.status === 204) this.handleSuccess(id);
        else { this.triggerToast('Escalation failed.', true); this.pendingEscalationId = null; }
      }
    });
  }

  private handleSuccess(id: number) {
    this.triggerToast(`Grievance #${id} escalated.`, false);
    this.pendingEscalationId = null;
    this.loadGrievancesForEscalation();
  }

  triggerToast(msg: string, isErr: boolean) {
    this.toastMessage = msg; this.isErrorToast = isErr; this.showToast = true;
    this.cdr.detectChanges();
    setTimeout(() => { this.showToast = false; this.cdr.detectChanges(); }, 3000);
  }
}