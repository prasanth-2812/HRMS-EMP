export interface AttendanceActivity {
  id: number;
  employee_id: number;
  employee_first_name: string;
  employee_last_name: string;
  attendance_date: string;
  shift_day?: number;
  in_datetime?: string;
  clock_in_date?: string;
  clock_in: string;
  clock_out_date?: string;
  out_datetime?: string;
  clock_out?: string;
}

export interface AttendanceActivityResponse {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: AttendanceActivity[];
  // For non-paginated response (current API returns array directly)
  data?: AttendanceActivity[];
}