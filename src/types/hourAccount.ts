// Hour Account module TypeScript interfaces

export interface Employee {
  id: string;
  employee_first_name: string;
  employee_last_name: string;
  email: string;
  phone: string;
  job_position_id?: string;
  department_id?: string;
  shift_id?: string;
  work_type_id?: string;
  employee_type_id?: string;
  job_role_id?: string;
  reporting_manager_id?: string;
  company_id?: string;
  location?: string;
  date_joining?: string;
  contract_end_date?: string;
  basic_salary?: number;
  salary_hour?: number;
  is_active?: boolean;
}

export interface EmployeeResponse {
  results: Employee[];
  count: number;
  next?: string;
  previous?: string;
}

export interface HourAccountRecord {
  id: number;
  employee_id: number;
  date: string;
  hours_worked: number;
  overtime_hours: number;
  break_hours: number;
  total_hours: number;
  hourly_rate: number;
  overtime_rate: number;
  total_pay: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface HourAccountSummary {
  employee_id: number;
  total_hours: number;
  total_overtime: number;
  total_pay: number;
  period_start: string;
  period_end: string;
}

export interface HourAccountFormData {
  employee_id: number;
  month: string;
  year: string;
  worked_hours: string;
  pending_hours: string;
  overtime: string;
}

export interface HourAccount {
  id: number;
  employee_id: number;
  month: string;
  year: string;
  worked_hours: string;
  pending_hours: string;
  overtime: string;
  created_at: string;
  updated_at: string;
}