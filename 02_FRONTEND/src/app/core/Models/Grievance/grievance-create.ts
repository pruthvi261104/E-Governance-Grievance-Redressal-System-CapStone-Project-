// src/app/core/models/grievance/grievance-create.ts

export interface GrievanceCreate {
  /** The subject or short summary of the complaint */
  title: string;

  /** Detailed explanation of the issue */
  description: string;

  /** * The ID of the selected category (e.g., Water Leakage, Power Cut). 
   * The backend uses this to auto-map the DepartmentId.
   */
  categoryId: number;
}