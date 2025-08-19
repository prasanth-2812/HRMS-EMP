#!/usr/bin/env python
import os
import sys
import django
from datetime import datetime, date

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'horilla.settings')
django.setup()

# Import models after Django setup
from employee.models import Employee
from base.models import Company, Department, JobPosition, JobRole, WorkType
from attendance.models import AttendanceGeneralSetting, Attendance
from base.horilla_company_manager import HorillaCompanyManager

def create_test_data():
    print("Creating test data...")
    
    # Create company if it doesn't exist
    company, created = Company.objects.get_or_create(
        company='Test Company',
        defaults={
            'address': '123 Test Street',
            'city': 'Test City',
            'state': 'Test State',
            'zip': '12345',
            'country': 'Test Country'
        }
    )
    if created:
        print(f"Created company: {company.company}")
    
    # Create department
    department, created = Department.objects.get_or_create(
        department='IT Department',
        defaults={'company_id': company}
    )
    if created:
        print(f"Created department: {department.department}")
    
    # Create job position
    job_position, created = JobPosition.objects.get_or_create(
        job_position='Software Developer',
        defaults={'department_id': department}
    )
    if created:
        print(f"Created job position: {job_position.job_position}")
    
    # Create job role
    job_role, created = JobRole.objects.get_or_create(
        job_role='Developer',
        defaults={'job_position_id': job_position}
    )
    if created:
        print(f"Created job role: {job_role.job_role}")
    
    # Create work type
    work_type, created = WorkType.objects.get_or_create(
        work_type='Full Time'
    )
    if created:
        print(f"Created work type: {work_type.work_type}")
    
    # Create test employees
    for i in range(1, 21):  # Create 20 employees
        employee, created = Employee.objects.get_or_create(
            employee_user_id=i,
            defaults={
                'employee_first_name': f'Employee{i}',
                'employee_last_name': f'Test{i}',
                'email': f'employee{i}@test.com',
                'phone': f'123456789{i}',
                'employee_work_info_id': job_position,
                'employee_work_info_job_role_id': job_role,
                'employee_work_info_work_type_id': work_type,
                'employee_work_info_department_id': department,
                'employee_work_info_company_id': company
            }
        )
        if created:
            print(f"Created employee: {employee.employee_first_name} {employee.employee_last_name}")
    
    # Create attendance records including ID 15
    attendance_date = date.today()
    
    for i in range(1, 21):  # Create 20 attendance records
        try:
            employee = Employee.objects.get(employee_user_id=i)
            attendance, created = Attendance.objects.get_or_create(
                employee_id=employee,
                attendance_date=attendance_date,
                defaults={
                    'attendance_clock_in': '09:00:00',
                    'attendance_clock_out': '17:00:00',
                    'attendance_worked_hour': '08:00:00',
                    'minimum_hour': '08:00:00',
                    'attendance_validated': True,
                    'work_type_id': work_type
                }
            )
            if created:
                print(f"Created attendance record ID {attendance.id} for employee {employee.employee_first_name}")
            else:
                print(f"Attendance record already exists for employee {employee.employee_first_name}")
        except Employee.DoesNotExist:
            print(f"Employee with ID {i} not found")
    
    # List all attendance records
    print("\nAll attendance records:")
    for attendance in Attendance.objects.all():
        print(f"ID: {attendance.id}, Employee: {attendance.employee_id.employee_first_name}, Date: {attendance.attendance_date}")

if __name__ == '__main__':
    create_test_data()