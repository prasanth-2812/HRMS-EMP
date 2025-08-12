import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import { useApi } from '../../hooks/useApi';
import { endpoints } from '../../utils/api';
import { AttendanceActivity } from '../../types/attendanceActivity';
import './AttendanceActivities.css';

const AttendanceActivities: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch attendance activity data
  const { data: activityData, loading, error, refetch } = useApi<AttendanceActivity[]>(
    endpoints.attendance.activity.list
  );
  
  const activities = activityData || [];
  
  // Filter activities based on search term
  const filteredActivities = activities.filter(activity => 
    searchTerm === '' || 
    `${activity.employee_first_name} ${activity.employee_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.attendance_date.includes(searchTerm)
  );
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format time for display
  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return timeString;
  };

  return (
    <div className="attendance-activities-page">
      <Sidebar />
      <div className={`ha-main-content ${isCollapsed ? 'ha-main-content--collapsed' : ''}`}>
        <div className={`ha-navbar ${isCollapsed ? 'ha-navbar--collapsed' : ''}`}>
          <Navbar pageTitle="Attendance Activity" />
        </div>
        <div className="ha-content ha-content--centered">
          {/* Breadcrumb */}
          <div className="ha-breadcrumb">
            <span className="ha-breadcrumb__item">Horilla</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item">attendance</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item ha-breadcrumb__item--active">attendance-activity-view</span>
          </div>

          {/* Page Title and Search */}
          <div className="ha-header ha-header--space-between">
            <h1 className="ha-header__title">Attendance Activity</h1>
            <div className="ha-search-box">
              <input
                type="text"
                placeholder="Search by employee name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ha-search-input"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="ha-loading-state ha-loading-state--centered">
              <div className="ha-spinner"></div>
              <p>Loading attendance activity records...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="ha-error-state ha-error-state--centered">
              <div className="ha-error-state__icon">⚠️</div>
              <h2 className="ha-error-state__title">Error Loading Data</h2>
              <p className="ha-error-state__message">{error}</p>
              <button className="ha-btn ha-btn--secondary" onClick={refetch}>
                Retry
              </button>
            </div>
          )}
          
          {/* Data Table */}
          {!loading && !error && (
            <>
              {filteredActivities.length === 0 ? (
                <div className="ha-empty-state ha-empty-state--centered">
                  <div className="ha-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" stroke="#bdbdbd" strokeWidth="2" fill="none" />
                      <path d="M15.5 15.5L19 19" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="11" cy="11" r="4" stroke="#bdbdbd" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  <h2 className="ha-empty-state__title">No Records found.</h2>
                  <p className="ha-empty-state__message">
                    {searchTerm ? 'No attendance activity records match your search.' : 'There are no attendance activity records to display.'}
                  </p>
                </div>
              ) : (
                <div className="ha-table-container">
                  <table className="ha-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Attendance Date</th>
                        <th>Clock In Date</th>
                        <th>Clock In Time</th>
                        <th>Clock Out Date</th>
                        <th>Clock Out Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActivities.map((activity) => (
                        <tr key={activity.id}>
                          <td>
                            <div className="ha-employee-info">
                              <span>{activity.employee_first_name} {activity.employee_last_name}</span>
                            </div>
                          </td>
                          <td>{formatDate(activity.attendance_date)}</td>
                          <td>{activity.clock_in_date ? formatDate(activity.clock_in_date) : '-'}</td>
                          <td>{formatTime(activity.clock_in)}</td>
                          <td>{activity.clock_out_date ? formatDate(activity.clock_out_date) : '-'}</td>
                          <td>{formatTime(activity.clock_out)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Results Summary */}
                  <div className="ha-results-summary">
                    <p>Showing {filteredActivities.length} of {activities.length} records</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <QuickAccess />
      </div>
    </div>
  );
};

export default AttendanceActivities;
