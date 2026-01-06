export interface CategoryReport {
  categoryName: string;
  count: number;
}

export interface DepartmentReport {
  departmentName: string;
  count: number;
}

export interface PerformanceReport {
  departmentName: string;
  totalGrievances: number;
  resolvedGrievances: number;
  pendingGrievances: number;
  averageResolutionHours: number;
}

export interface StatusReport {
  status: string;
  count: number;
}