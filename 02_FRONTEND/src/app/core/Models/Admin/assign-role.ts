export interface AssignRole {
  userId: number;
  roleName: string;      // DepartmentOfficer, SupervisoryOfficer, Citizen, Admin
  departmentId?: number; // Required only if role is officer
}
