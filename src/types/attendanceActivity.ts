export interface AttendanceActivity {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  employee_id: number;
  attendance_date: string;
  attendance_clock_in?: string;
  attendance_clock_out?: string;
  clock_in_date?: string;
  clock_out_date?: string;
  clock_in?: string;
  clock_out?: string;
  attendance_worked_hour?: string;
  minimum_hour?: string;
  shift_name?: string;
  work_type?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}