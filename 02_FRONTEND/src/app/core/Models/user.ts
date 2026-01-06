import { Role } from './role';
import { Department } from './department';
export interface User {
  id: number;
  fullName: string;
  email: string;

  roleId: number;
  role: Role;

  departmentId?: number;
  department?: Department;

  isActive: boolean;
  createdAt: string;
}
