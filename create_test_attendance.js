// Script to create test attendance records including ID 15
// Run this in the browser console after logging into the application

async function createTestAttendanceRecords() {
    const API_BASE_URL = 'http://localhost:8000';
    
    // Get auth token from localStorage
    const authToken = localStorage.getItem('access') || localStorage.getItem('authToken');
    if (!authToken) {
        console.error('No auth token found. Please log in first.');
        console.log('Available localStorage keys:', Object.keys(localStorage));
        return;
    }
    
    console.log('Using auth token:', authToken ? 'Token found' : 'No token');
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
    
    // First, let's create some employees if they don't exist
    console.log('Creating test employees...');
    const employees = [];
    
    for (let i = 1; i <= 20; i++) {
        try {
            const employeeData = {
                employee_first_name: `Employee${i}`,
                employee_last_name: `Test${i}`,
                email: `employee${i}@test.com`,
                phone: `123456789${i}`,
                employee_user_id: i
            };
            
            const response = await fetch(`${API_BASE_URL}/api/v1/employee/employee/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(employeeData)
            });
            
            if (response.ok) {
                const employee = await response.json();
                employees.push(employee);
                console.log(`Created employee: ${employee.employee_first_name} ${employee.employee_last_name}`);
            } else {
                console.log(`Employee ${i} might already exist or creation failed`);
                // Try to get existing employee
                const getResponse = await fetch(`${API_BASE_URL}/api/v1/employee/employee/${i}/`, {
                    headers: headers
                });
                if (getResponse.ok) {
                    const employee = await getResponse.json();
                    employees.push(employee);
                }
            }
        } catch (error) {
            console.log(`Error creating employee ${i}:`, error);
        }
    }
    
    // Now create attendance records
    console.log('Creating attendance records...');
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 1; i <= 20; i++) {
        try {
            const attendanceData = {
                employee_id: i,
                attendance_date: today,
                attendance_clock_in: '09:00:00',
                attendance_clock_out: '17:00:00',
                attendance_worked_hour: '08:00:00',
                minimum_hour: '08:00:00',
                attendance_validated: true,
                shift_id: 1,
                work_type_id: 1
            };
            
            const response = await fetch(`${API_BASE_URL}/api/v1/attendance/attendance/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(attendanceData)
            });
            
            if (response.ok) {
                const attendance = await response.json();
                console.log(`Created attendance record ID ${attendance.id} for employee ${i}`);
            } else {
                const errorText = await response.text();
                console.log(`Failed to create attendance for employee ${i}:`, errorText);
            }
        } catch (error) {
            console.log(`Error creating attendance for employee ${i}:`, error);
        }
    }
    
    // List all attendance records
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/attendance/attendance/`, {
            headers: headers
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('\nAll attendance records:');
            data.results.forEach(record => {
                console.log(`ID: ${record.id}, Employee: ${record.employee_first_name} ${record.employee_last_name}, Date: ${record.attendance_date}`);
            });
        }
    } catch (error) {
        console.log('Error fetching attendance records:', error);
    }
    
    console.log('Test data creation completed!');
}

// Run the function
createTestAttendanceRecords();

// Also create attendance requests
async function createTestAttendanceRequests() {
    const API_BASE_URL = 'http://localhost:8000';
    // Try both token keys to ensure compatibility
    const authToken = localStorage.getItem('access') || localStorage.getItem('authToken');
    
    if (!authToken) {
        console.error('No auth token found. Please log in first.');
        console.log('Available localStorage keys:', Object.keys(localStorage));
        return;
    }
    
    console.log('Using auth token:', authToken ? 'Token found' : 'No token');
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    };
    
    console.log('Creating attendance requests...');
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 1; i <= 20; i++) {
        try {
            const requestData = {
                employee_id: i,
                attendance_date: today,
                shift_id: 1,
                work_type_id: 1,
                minimum_hour: '08:00',
                request_description: `Test attendance request for employee ${i}`,
                attendance_clock_in_date: today,
                attendance_clock_in: '09:00:00',
                attendance_clock_out_date: today,
                attendance_clock_out: '17:00:00',
                attendance_worked_hour: '08:00',
                batch_attendance_id: null
            };
            
            const response = await fetch(`${API_BASE_URL}/api/v1/attendance/attendance-request/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestData)
            });
            
            if (response.ok) {
                const request = await response.json();
                console.log(`Created attendance request ID ${request.id} for employee ${i}`);
            } else {
                const errorText = await response.text();
                console.log(`Failed to create attendance request for employee ${i}:`);
                console.log(`Status: ${response.status} ${response.statusText}`);
                console.log(`Error response:`, errorText);
                console.log(`Request payload was:`, JSON.stringify(requestData, null, 2));
            }
        } catch (error) {
            console.log(`Error creating attendance request for employee ${i}:`, error);
        }
    }
}

// Also run attendance requests creation
setTimeout(() => {
    createTestAttendanceRequests();
}, 5000); // Wait 5 seconds after attendance records