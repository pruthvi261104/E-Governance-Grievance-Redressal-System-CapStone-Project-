import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CitizenService } from '../services/citizen';
import { GrievanceCreate } from '../../../core/Models/Grievance/grievance';
import { Category } from '../../../core/Models/category';
import { NotificationService } from '../../../core/services/notification';
@Component({
  selector: 'app-lodge-grievance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './lodge-grievance.html',
  styleUrl: './lodge-grievance.css'
})
export class LodgeGrievance implements OnInit {
  private notificationService = inject(NotificationService);
  private fb = inject(FormBuilder);
  private citizenService = inject(CitizenService);
  private cdr = inject(ChangeDetectorRef);

  lodgeForm: FormGroup;
  categories: Category[] = [];
  showToast = false;
  toastMessage = '';

  constructor() {
    this.lodgeForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      description: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.citizenService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.lodgeForm.valid) {
      const payload: GrievanceCreate = {
        title: this.lodgeForm.value.title,
        description: this.lodgeForm.value.description,
        categoryId: Number(this.lodgeForm.value.categoryId)
      };

      this.citizenService.lodgeGrievance(payload).subscribe({
        next: () => {
          this.triggerToast('Grievance lodged successfully!');
          this.lodgeForm.reset({ categoryId: '' });
          this.notificationService.triggerRefresh();
        },
        error: () => this.triggerToast('Failed to lodge grievance', true)
      });
    }
  }

  triggerToast(msg: string, isError = false) {
    this.toastMessage = msg;
    this.showToast = true;
    setTimeout(() => { this.showToast = false; this.cdr.detectChanges(); }, 3000);
  }
}