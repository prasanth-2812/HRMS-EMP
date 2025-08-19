import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import WorkRecordFilterEmployee from './modals/WorkRecordFilterEmployee';
import WorkRecordFilterWorkInfo from './modals/WorkRecordFilterWorkInfo';
import WorkRecordFilterAdvance from './modals/WorkRecordFilterAdvance';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../utils/api';
import { EmployeeResponse } from '../../types/hourAccount';
import './WorkRecords.css';

interface AttendanceRecord {
  id: number;
  employee_id: number;
  attendance_date: string;
  attendance_validated: boolean;
  attendance_clock_in?: string;
  attendance_clock_out?: string;
  employee_first_name?: string;
  employee_last_name?: string;
}

interface AttendanceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttendanceRecord[];
}

const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const WorkRecords: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('employee');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Month/year state for input type month
  const [monthYear, setMonthYear] = useState(() => {
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${y}-${m}`;
  });

  // Fetch employees
  const { data: employeeData, loading: employeeLoading } = useApi<EmployeeResponse>(
    endpoints.employees.list
  );

  // Fetch attendance records
  const { data: attendanceData, loading: attendanceLoading } = useApi<AttendanceResponse>(
    endpoints.attendance.list
  );

  const employees = employeeData?.results || [];
  const attendanceRecords = attendanceData?.results || [];

  // Generate calendar days for selected month
  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get attendance status for specific employee and date
  const getAttendanceStatus = (employeeId: number, day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const attendance = attendanceRecords.find(
      record => record.employee_id === employeeId && record.attendance_date === dateStr
    );
    
    if (!attendance) return null;
    return {
      validated: attendance.attendance_validated,
      hasClockIn: !!attendance.attendance_clock_in,
      hasClockOut: !!attendance.attendance_clock_out
    };
  };

  // Get status color and symbol
  const getStatusDisplay = (status: any) => {
    if (!status) return { color: '', symbol: '', title: 'No Record' };
    
    if (status.validated) {
      return { 
        color: 'present', 
        symbol: 'P', 
        title: 'Present - Validated' 
      };
    } else {
      return { 
        color: 'pending', 
        symbol: '!', 
        title: 'Attendance needs validation' 
      };
    }
  };

  // Update month/year when monthYear input changes
  const handleMonthYearChange = (value: string) => {
    setMonthYear(value);
    const [year, month] = value.split('-').map(Number);
    setSelectedYear(year);
    setSelectedMonth(month - 1); // month is 0-indexed
  };

  // Handle Filter Button in modal (here just closes modal after click, adjust as needed)
  const handleApplyFilter = () => {
    setShowFilter(false);
  };

  // Handle navigation to attendance records for validation
  const handleValidationClick = () => {
    navigate('/attendance/attendances');
  };

  // Export table data as Excel file
  const handleExport = () => {
    const headers = ['Employee', ...days.map(day => day.toString())];
    const rows = employees.map(employee => {
      const employeeName = `${employee.employee_first_name} ${employee.employee_last_name}`;
      const attendanceRow = days.map(day => {
        const status = getAttendanceStatus(employee.id, day);
        const display = getStatusDisplay(status);
        return display.symbol || '';
      });
      return [employeeName, ...attendanceRow];
    });
    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'WorkRecords');
    XLSX.writeFile(wb, `work-records-${monthNames[selectedMonth]}-${selectedYear}.xlsx`);
  };

  return (
    <div className="work-records-page">
      <Sidebar />
      <div className={`ha-main-content ${isCollapsed ? 'ha-main-content--collapsed' : ''}`}>
        <div className={`ha-navbar ${isCollapsed ? 'ha-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="ha-content ha-content--centered">
          {/* Breadcrumb */}
          <div className="ha-breadcrumb">
            <span className="ha-breadcrumb__item">Horilla</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item">attendance</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item ha-breadcrumb__item--active">work-records</span>
          </div>

          {/* Header Section */}
          <div className="wr-header-card">
            <div className="wr-header-title-row">
              <h1 className="wr-header-title">Work Records</h1>
              <div className="wr-header-date-picker">
                <span className="wr-header-date-label">Date: {formattedDate}</span>
                <label className="wr-header-month-label" htmlFor="wr-header-month-input">Month/Year</label>
                <input
                  id="wr-header-month-input"
                  type="month"
                  className="wr-header-month-input"
                  value={monthYear}
                  onChange={e => handleMonthYearChange(e.target.value)}
                  style={{ minWidth: 120 }}
                />
                <span className="wr-header-month-icon">📅</span>
              </div>
            </div>
            <div className="wr-header-actions">
              <button className="wr-btn wr-btn--export" onClick={handleExport}>Export</button>
              <button className="wr-btn wr-btn--filter" onClick={() => setShowFilter(true)}>Filter</button>
            </div>
            <div className="wr-header-legend">
              <span className="wr-legend-dot wr-legend-dot--present"></span> Present
              <span className="wr-legend-dot wr-legend-dot--halfday"></span> Half Day Present
              <span className="wr-legend-dot wr-legend-dot--onleave"></span> On leave, But attendance exist
              <span className="wr-legend-dot wr-legend-dot--leave"></span> Leave
              <span className="wr-legend-dot wr-legend-dot--absent"></span> Absent
              <span className="wr-legend-dot wr-legend-dot--conflict"></span> Conflict
            </div>
          </div>

          {/* Loading State */}
          {(employeeLoading || attendanceLoading) && (
            <div className="wr-loading-state">
              <div className="wr-spinner"></div>
              <p>Loading work records...</p>
            </div>
          )}

          {/* Table Section */}
          {!employeeLoading && !attendanceLoading && (
            <div className="wr-table-container">
              <table className="wr-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    {days.map(day => (
                      <th key={day}>{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map(employee => (
                    <tr key={employee.id}>
                      <td className="wr-employee-cell">
                        <div className="wr-employee-info">
                          <span className="wr-employee-name">
                            {employee.employee_first_name} {employee.employee_last_name}
                          </span>
                          {employee.badge_id && (
                            <span className="wr-employee-badge">({employee.badge_id})</span>
                          )}
                        </div>
                      </td>
                      {days.map(day => {
                        const status = getAttendanceStatus(employee.id, day);
                        const display = getStatusDisplay(status);
                        const needsValidation = status && !status.validated;
                        return (
                          <td key={day} className="wr-day-cell">
                            {status && (
                              <span 
                                className={`wr-status wr-status--${display.color} ${needsValidation ? 'wr-status--clickable' : ''}`}
                                title={display.title}
                                onClick={needsValidation ? handleValidationClick : undefined}
                                style={needsValidation ? { cursor: 'pointer' } : {}}
                              >
                                {display.symbol}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="wr-pagination">
            <span>Page 1 of 1.</span>
            <span className="wr-pagination-controls">
              Page <input type="text" value="1" readOnly style={{ width: 32, textAlign: 'center' }} /> of 1
            </span>
          </div>
        </div>
        <QuickAccess />

        {/* Slide-Over Filter Panel */}
        {showFilter && (
          <>
            <div className="wr-filter-modal-overlay" onClick={() => setShowFilter(false)}></div>
            <div className="wr-filter-side-panel">
              <button className="wr-filter-modal-close" onClick={() => setShowFilter(false)}>&times;</button>
              <div className="wr-filter-modal-content">
                {/* Accordion sections */}
                <div
                  className={`wr-filter-section ${openSection === 'employee' ? 'wr-filter-section--open' : ''}`}
                  onClick={() => setOpenSection(openSection === 'employee' ? null : 'employee')}
                >
                  <div className="wr-filter-section-title-row">
                    <span className="wr-filter-section-title">Employee</span>
                    <span className={`wr-filter-section-arrow ${openSection === 'employee' ? 'open' : ''}`}>▼</span>
                  </div>
                  <div className="wr-filter-section-divider"></div>
                  <div style={{ display: openSection === 'employee' ? 'block' : 'none', marginTop: 10, marginBottom: 4 }}>
                    <WorkRecordFilterEmployee />
                  </div>
                </div>

                {/* Work Info Section */}
                <div
                  className={`wr-filter-section ${openSection === 'workinfo' ? 'wr-filter-section--open' : ''}`}
                  onClick={() => setOpenSection(openSection === 'workinfo' ? null : 'workinfo')}
                >
                  <div className="wr-filter-section-title-row">
                    <span className="wr-filter-section-title">Work Info</span>
                    <span className={`wr-filter-section-arrow ${openSection === 'workinfo' ? 'open' : ''}`}>▼</span>
                  </div>
                  <div className="wr-filter-section-divider"></div>
                  <div style={{ display: openSection === 'workinfo' ? 'block' : 'none', marginTop: 10, marginBottom: 4 }}>
                    {openSection === 'workinfo' && <WorkRecordFilterWorkInfo />}
                  </div>
                </div>

                {/* Advanced Section */}
                <div
                  className={`wr-filter-section ${openSection === 'advanced' ? 'wr-filter-section--open' : ''}`}
                  onClick={() => setOpenSection(openSection === 'advanced' ? null : 'advanced')}
                >
                  <div className="wr-filter-section-title-row">
                    <span className="wr-filter-section-title">Advanced</span>
                    <span className={`wr-filter-section-arrow ${openSection === 'advanced' ? 'open' : ''}`}>▼</span>
                  </div>
                  <div className="wr-filter-section-divider"></div>
                  <div style={{ display: openSection === 'advanced' ? 'block' : 'none', marginTop: 10, marginBottom: 4 }}>
                    {openSection === 'advanced' && <WorkRecordFilterAdvance />}
                  </div>
                </div>
              </div>
              <button className="wr-btn wr-btn--primary wr-filter-btn" onClick={handleApplyFilter}>
                Filter
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkRecords;
