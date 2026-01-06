// grievance.ts
import { GrievanceStatus } from './grievance-status';

export interface Grievance {
  grievanceId: number;
  title: string;
  description: string;
  status: GrievanceStatus;
  categoryName: string;
  departmentName: string;
  assignedOfficerName?: string;
  createdAt: string;
  isEscalated: boolean;
}

export interface GrievanceCreate {
  title: string;
  description: string;
  categoryId: number;
}

export interface StatusUpdateDto {
  remarks: string;
}