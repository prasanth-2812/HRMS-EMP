import React, { useState, useEffect } from 'react';
import SendMail from './modals/sendMail';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import { useApi } from '../../hooks/useApi';
import { apiClient, endpoints } from '../../utils/api';
import { getAllEmployees } from '../../services/employeeService';
import './AttendanceDashboard.css';

// Interfaces for dashboard data
interface AttendanceStats {
  totalAttendances: number;
  onTimeCount: number;
  lateCount: number;
  attendancePercentage: number;
  onTimePercentage: number;
  latePercentage: number;
}

interface AttendanceRecord {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  employee_id: number;
  attendance_date: string;
  attendance_clock_in: string | null;
  attendance_clock_out: string | null;
  attendance_validated: boolean;
  attendance_overtime_approve: boolean;
  is_active: boolean;
}

interface AttendanceResponse {
  results: AttendanceRecord[];
  count: number;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  avatar?: string;
}

const AttendanceDashboard: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0]);
  const [mailModalOpen, setMailModalOpen] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    totalAttendances: 0,
    onTimeCount: 0,
    lateCount: 0,
    attendancePercentage: 0,
    onTimePercentage: 0,
    latePercentage: 0
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [offlineEmployees, setOfflineEmployees] = useState<Employee[]>([]);
  const [attendancesToValidate, setAttendancesToValidate] = useState<AttendanceRecord[]>([]);
  const [overtimeToApprove, setOvertimeToApprove] = useState<AttendanceRecord[]>([]);
  const [todayAttendances, setTodayAttendances] = useState<AttendanceRecord[]>([]);
  const [offlineEmployeesCount, setOfflineEmployeesCount] = useState<number>(0);

  // API hooks for different attendance types
  const { data: attendanceData, loading: attendanceLoading } = useApi<AttendanceResponse>('/api/v1/attendance/attendance/');
  const { data: validateAttendanceData, loading: validateLoading } = useApi<AttendanceResponse>('/api/v1/attendance/attendance/list/validate');
  const { data: overtimeAttendanceData, loading: overtimeLoading } = useApi<AttendanceResponse>('/api/v1/attendance/attendance/list/overtime');
  const { data: todayAttendanceData, loading: todayLoading } = useApi<AttendanceResponse>(endpoints.attendance.todayAttendance);
  const { data: offlineEmployeesData, loading: offlineLoading } = useApi<{results: Employee[]}>(endpoints.attendance.offlineEmployees.list);
  const { data: offlineCountData, loading: offlineCountLoading } = useApi<{count: number}>(endpoints.attendance.offlineEmployees.count);

  // Calculate attendance statistics
  const calculateAttendanceStats = (records: AttendanceRecord[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(record => record.attendance_date === today);
    
    const totalAttendances = todayRecords.length;
    const onTimeCount = todayRecords.filter(record => {
      if (!record.attendance_clock_in) return false;
      const clockInTime = new Date(`${record.attendance_date}T${record.attendance_clock_in}`);
      const nineAM = new Date(`${record.attendance_date}T09:00:00`);
      return clockInTime <= nineAM;
    }).length;
    const lateCount = totalAttendances - onTimeCount;
    
    const attendancePercentage = employees.length > 0 ? (totalAttendances / employees.length) * 100 : 0;
    const onTimePercentage = totalAttendances > 0 ? (onTimeCount / totalAttendances) * 100 : 0;
    const latePercentage = totalAttendances > 0 ? (lateCount / totalAttendances) * 100 : 0;
    
    return {
      totalAttendances,
      onTimeCount,
      lateCount,
      attendancePercentage,
      onTimePercentage,
      latePercentage
    };
  };

  // Load employees data
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesData = await getAllEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Failed to load employees:', error);
      }
    };
    
    loadEmployees();
  }, []);

  // Update offline employees from API
  useEffect(() => {
    if (offlineEmployeesData?.results) {
      setOfflineEmployees(offlineEmployeesData.results);
    }
  }, [offlineEmployeesData]);

  // Update offline employees count from API
  useEffect(() => {
    if (offlineCountData) {
      setOfflineEmployeesCount(offlineCountData.count);
    }
  }, [offlineCountData]);

  // Update statistics when attendance data changes
  useEffect(() => {
    if (attendanceData?.results) {
      const stats = calculateAttendanceStats(attendanceData.results);
      setAttendanceStats(stats);
    }
  }, [attendanceData, employees]);

  // Update validation records from dedicated endpoint
  useEffect(() => {
    if (validateAttendanceData?.results) {
      setAttendancesToValidate(validateAttendanceData.results);
    }
  }, [validateAttendanceData]);

  // Update overtime records from dedicated endpoint
  useEffect(() => {
    if (overtimeAttendanceData?.results) {
      setOvertimeToApprove(overtimeAttendanceData.results);
    }
  }, [overtimeAttendanceData]);

  // Handle attendance validation using the dedicated validate endpoint
  const handleValidateAttendance = async (recordId: number) => {
    try {
      // Use the dedicated attendance-validate endpoint
      await apiClient.put(`/api/v1/attendance/attendance-validate/${recordId}`);
      
      // Update local state to reflect validation
      setAttendancesToValidate(prev => 
        prev.filter(record => record.id !== recordId)
      );
      
      // Optionally refresh the data
      // You can add a refetch mechanism here if needed
    } catch (error) {
      console.error('Failed to validate attendance:', error);
    }
  };

  return (
    <div className="attendance-dashboard-page">
      <Sidebar />
      <div className={`ad-main-content ${isCollapsed ? 'ad-main-content--collapsed' : ''}`}>
        <div className={`ad-navbar ${isCollapsed ? 'ad-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="ad-content">
          <div className="ad-content-container">
            {/* Top Statistics Cards */}
            <div className="ad-stats-grid">
              <div className="ad-stat-card ad-stat-card--blue">
                <div className="ad-stat-card__header">
                  <h3 className="ad-stat-card__title">Today's Attendances</h3>
                </div>
                <div className="ad-stat-card__content">
                  <div className="ad-stat-card__value">
                    {attendanceLoading ? 'Loading...' : `${attendanceStats.attendancePercentage.toFixed(1)}%`}
                  </div>
                  <div className="ad-stat-card__progress">
                    <div className="ad-progress-bar">
                      <div className="ad-progress-bar__fill ad-progress-bar__fill--blue" style={{ width: `${attendanceStats.attendancePercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ad-stat-card ad-stat-card--green">
                <div className="ad-stat-card__header">
                  <h3 className="ad-stat-card__title">On Time</h3>
                </div>
                <div className="ad-stat-card__content">
                  <div className="ad-stat-card__value">
                    {attendanceLoading ? 'Loading...' : attendanceStats.onTimeCount}
                  </div>
                  <div className="ad-stat-card__progress">
                    <div className="ad-progress-bar">
                      <div className="ad-progress-bar__fill ad-progress-bar__fill--green" style={{ width: `${attendanceStats.onTimePercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ad-stat-card ad-stat-card--red">
                <div className="ad-stat-card__header">
                  <h3 className="ad-stat-card__title">Late Come</h3>
                </div>
                <div className="ad-stat-card__content">
                  <div className="ad-stat-card__value">
                    {attendanceLoading ? 'Loading...' : attendanceStats.lateCount}
                  </div>
                  <div className="ad-stat-card__progress">
                    <div className="ad-progress-bar">
                      <div className="ad-progress-bar__fill ad-progress-bar__fill--red" style={{ width: `${attendanceStats.latePercentage}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Status Cards */}
            <div className="ad-additional-cards-grid">
              <div className="ad-status-card">
                <div className="ad-status-card__header">
                  <h3 className="ad-status-card__title">On Break</h3>
                </div>
                <div className="ad-status-card__content">
                  <div className="ad-empty-state">
                    <div className="ad-empty-state__icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2v10l4 4"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <p className="ad-empty-state__text">No employees are currently taking a break.</p>
                  </div>
                </div>
              </div>

              <div className="ad-status-card">
                <div className="ad-status-card__header">
                  <h3 className="ad-status-card__title">Overtime To Approve ({overtimeToApprove.length})</h3>
                </div>
                <div className="ad-status-card__content">
                  {overtimeToApprove.length === 0 ? (
                    <div className="ad-empty-state">
                      <div className="ad-empty-state__icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m15 9-6 6"></path>
                          <path d="m9 9 6 6"></path>
                        </svg>
                      </div>
                      <div className="ad-empty-state__content">
                        <h4 className="ad-empty-state__title">No Records found.</h4>
                        <p className="ad-empty-state__text">No overtime records pending approval.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="ad-records-list">
                      {overtimeToApprove.slice(0, 5).map((record) => (
                        <div key={record.id} className="ad-record-item">
                          <div className="ad-record-info">
                            <span className="ad-record-name">
                              {record.employee_first_name} {record.employee_last_name}
                            </span>
                            <span className="ad-record-date">{record.attendance_date}</span>
                          </div>
                          <div className="ad-record-time">
                            {record.attendance_clock_in} - {record.attendance_clock_out}
                          </div>
                        </div>
                      ))}
                      {overtimeToApprove.length > 5 && (
                        <div className="ad-record-more">+{overtimeToApprove.length - 5} more</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Status Cards */}
            <div className="ad-bottom-cards-grid">
              <div className="ad-status-card">
                <div className="ad-status-card__header">
                  <h3 className="ad-status-card__title">Attendance To Validate ({attendancesToValidate.length})</h3>
                </div>
                <div className="ad-status-card__content">
                  {attendancesToValidate.length === 0 ? (
                    <div className="ad-empty-state">
                      <div className="ad-empty-state__icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M9 12l2 2 4-4"></path>
                          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                          <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
                        </svg>
                      </div>
                      <p className="ad-empty-state__text">All attendance records are validated.</p>
                    </div>
                  ) : (
                    <div className="ad-records-list">
                      {attendancesToValidate.slice(0, 5).map((record) => (
                        <div key={record.id} className="ad-record-item">
                          <div className="ad-record-info">
                            <span className="ad-record-name">
                              {record.employee_first_name} {record.employee_last_name}
                            </span>
                            <span className="ad-record-date">{record.attendance_date}</span>
                          </div>
                          <div className="ad-record-actions">
                            <button 
                              className="ad-btn ad-btn--validate"
                              onClick={() => handleValidateAttendance(record.id)}
                              title="Validate Attendance"
                            >
                              Validate
                            </button>
                          </div>
                        </div>
                      ))}
                      {attendancesToValidate.length > 5 && (
                        <div className="ad-record-more">+{attendancesToValidate.length - 5} more</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="ad-status-card">
                <div className="ad-status-card__header">
                  <h3 className="ad-status-card__title">Department Overtime Chart</h3>
                  <div className="ad-status-card__controls">
                    <select className="ad-select" defaultValue="Day">
                      <option value="Day">Day</option>
                      <option value="Week">Week</option>
                      <option value="Month">Month</option>
                    </select>
                    <input 
                      type="date"
                      className="ad-date-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />

                  </div>
                </div>
                <div className="ad-status-card__content">
                  <div className="ad-empty-state">
                    <div className="ad-empty-state__icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M3 3v18h18"></path>
                        <path d="M7 12l4-4 4 4 6-6"></path>
                      </svg>
                    </div>
                    <p className="ad-empty-state__text">No overtime data available.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Sections */}
            <div className="ad-dashboard-grid">
              {/* Attendance Analytic */}
              <div className="ad-dashboard-card">
                <div className="ad-dashboard-card__header">
                  <h3 className="ad-dashboard-card__title">Attendance Analytic</h3>
                  <div className="ad-dashboard-card__controls">
                    <select 
                      className="ad-select"
                      value="Day"
                      onChange={(e) => {}}
                    >
                      <option value="Day">Day</option>
                      <option value="Week">Week</option>
                      <option value="Month">Month</option>
                    </select>
                    <input 
                      type="date"
                      className="ad-date-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="ad-dashboard-card__content">
                  <div className="ad-empty-chart">
                    <div className="ad-empty-chart__icon">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M3 3v18h18"></path>
                        <path d="M7 12l4-4 4 4 6-6"></path>
                      </svg>
                    </div>
                    <p className="ad-empty-chart__text">No records available at the moment.</p>
                  </div>
                </div>
              </div>

              {/* Offline Employees */}
              <div className="ad-dashboard-card">
                <div className="ad-dashboard-card__header">
                  <h3 className="ad-dashboard-card__title">Offline Employees ({offlineEmployeesCount})</h3>
                </div>
                <div className="ad-dashboard-card__content">
                  {offlineLoading ? (
                     <div className="ad-loading-state">
                       <div className="ad-spinner"></div>
                       <span>Loading offline employees...</span>
                     </div>
                   ) : (offlineEmployees || []).length === 0 ? (
                     <div className="ad-empty-state">
                       <div className="ad-empty-state__icon">
                         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                           <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                           <circle cx="9" cy="7" r="4"></circle>
                           <path d="m22 2-5 5"></path>
                           <path d="m17 7 5-5"></path>
                         </svg>
                       </div>
                       <p className="ad-empty-state__text">All employees are online today!</p>
                     </div>
                   ) : (
                    <div className="ad-employee-list">
                      {(offlineEmployees || []).slice(0, 10).map((employee) => (
                        <div key={employee.id} className="ad-employee-item">
                          <div className="ad-employee-avatar">
                            {employee.avatar ? (
                              <img src={employee.avatar} alt={employee.firstName || 'Employee'} className="ad-avatar-img" />
                            ) : (
                              <div className="ad-avatar-img ad-avatar-placeholder">
                                {(employee.firstName || '').charAt(0)}{(employee.lastName || '').charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="ad-employee-info">
                            <div className="ad-employee-name">{(employee.firstName || '')} {(employee.lastName || '')}</div>
                            <div className="ad-employee-status">{employee.status || 'Absent'}</div>
                          </div>
                          <div className="ad-employee-actions">
                            <button className="ad-icon-btn" onClick={() => setMailModalOpen(true)} title="Send Mail">
                              <span role="img" aria-label="mail">✉️</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      {(offlineEmployees || []).length > 10 && (
                         <div className="ad-employee-more">+{(offlineEmployees || []).length - 10} more</div>
                       )}
                    </div>
                  )}
                </div>
              </div>

              {/* Hours Chart */}
              <div className="ad-dashboard-card">
                <div className="ad-dashboard-card__header">
                  <h3 className="ad-dashboard-card__title">Hours Chart</h3>
                  <div className="ad-dashboard-card__controls">
                    <input 
                      type="date"
                      className="ad-date-input"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                  </div>
                </div>
                <div className="ad-dashboard-card__content">
                  <div className="ad-empty-chart">
                    <div className="ad-empty-chart__icon">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                      </svg>
                    </div>
                    <p className="ad-empty-chart__text">No records available at the moment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QuickAccess />
        {/* SendMail Modal */}
        <SendMail
          open={mailModalOpen}
          onClose={() => setMailModalOpen(false)}
          employee={{ name: 'tarun sai', avatar: 'TS' }}
        />
      </div>
    </div>
  );
};

export default AttendanceDashboard;
