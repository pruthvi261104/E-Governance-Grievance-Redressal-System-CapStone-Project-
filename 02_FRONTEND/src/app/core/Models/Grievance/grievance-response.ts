// core/Models/Grievance/grievance-response.ts

export interface GrievanceResponse {
  grievanceId: number;         // Matches backend
  title: string;
  description: string;
  status: string;              // Backend returns string statuses like "Submitted", "Assigned"
  categoryName: string;
  departmentName: string;
  assignedOfficerName: string | null; // Use null for unassigned grievances
  createdAt: string;
  isEscalated: boolean;
  assignedOfficerId?: number;
}

// Required for /in-review and /resolve endpoints
export interface StatusUpdateDto {
  remarks: string;             // Matches { "remarks": "string" }
}