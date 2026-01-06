export interface Notification {
  id: number;
  userId: string;
  grievanceId: number;
  message: string;
  type: string;
  isRead: boolean;
  createdOn: Date;
}