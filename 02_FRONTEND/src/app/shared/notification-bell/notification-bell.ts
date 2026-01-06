import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NotificationService } from '../../core/services/notification';
import { Notification } from '../../core/Models/Notification';
import { CommonModule } from '@angular/common';
import { Token } from '../../core/auth/token';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.html',
  styleUrls: ['./notification-bell.css']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  showDropdown = false;
  private isUpdating = false;
  private pollingInterval: any;
  private refreshSub!: Subscription;
  
  private tokenService = inject(Token);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // ✅ Fix: Ensure the refresh signal is forced even if an interval is pending
    this.refreshSub = this.notificationService.refreshNeeded$.subscribe(() => {
      this.isUpdating = false; // Reset lock to allow the instant refresh
      this.loadNotifications();
    });

    setTimeout(() => {
      const authToken = localStorage.getItem('auth_token');
      if (authToken && !localStorage.getItem('token')) {
        localStorage.setItem('token', authToken);
      }
      this.initNotificationLogic();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
    if (this.refreshSub) this.refreshSub.unsubscribe();
  }

  private initNotificationLogic() {
    if (this.tokenService.isLoggedIn()) {
      this.loadNotifications();
      this.pollingInterval = setInterval(() => {
        if (this.tokenService.isLoggedIn()) {
          this.loadNotifications();
        }
      }, 5000); 
    }
  }

  loadNotifications() {
    if (this.isUpdating) return; 

    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        setTimeout(() => {
          this.notifications = data;
          this.unreadCount = data.filter(n => !n.isRead).length;
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => console.error('Error loading notifications', err)
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    
    // Automatically Mark as read when opening the view
    if (this.showDropdown && this.unreadCount > 0) {
      this.clearAll();
    }
  }

  clearAll() {
    if (this.isUpdating) return;
    this.isUpdating = true;
    setTimeout(() => {
      const unreadNotifications = this.notifications.filter(n => !n.isRead);
      if (unreadNotifications.length === 0) {
        this.isUpdating = false;
        return;
      }

      // Optimistic UI update
      this.notifications.forEach(n => n.isRead = true);
      this.unreadCount = 0;
      this.cdr.detectChanges();

      this.notificationService.markAllAsRead(unreadNotifications).subscribe({
        next: () => {
          this.isUpdating = false;
          this.loadNotifications(); 
        },
        error: (err) => {
          console.error('Error clearing notifications', err);
          this.isUpdating = false;
          this.loadNotifications(); 
        }
      });
    }, 0);
  }

  readNotification(notification: Notification) {
    this.showDropdown = false;
  }
}