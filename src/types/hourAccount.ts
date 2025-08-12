export interface HourAccount {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  employee_profile_url: string;
  badge_id: string | null;
  employee_id: number;
  month: string;
  year: string;
  worked_hours: string;
  pending_hours: string;
  overtime: string;
}

export interface HourAccountResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HourAccount[];
}

export interface HourAccountFormData {
  employee_id: number;
  month: string;
  year: string;
  worked_hours: string;
  pending_hours: string;
  overtime: string;
}

export interface Employee {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  badge_id?: string;
  employee_profile?: string;
  email?: string;
}

export interface EmployeeResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Employee[];
}