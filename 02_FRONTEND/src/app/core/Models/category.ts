// category.ts
export interface Category {
  id: number;
  name: string;
  departmentId: number;
  departmentName?: string;
}

// department.ts
export interface Department {
  id: number;
  name: string;
}