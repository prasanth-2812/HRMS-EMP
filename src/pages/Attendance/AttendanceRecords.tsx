import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './AttendanceRecords.css';

const AttendanceRecords: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="attendance-records-page">
      <Sidebar />
      <div className={`ar-main-content ${isCollapsed ? 'ar-main-content--collapsed' : ''}`}>
        <div className={`ar-navbar ${isCollapsed ? 'ar-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="ar-content">
          <div className="ar-content-container">
            {/* Page Header */}
            <div className="ar-header">
              <div className="ar-header__left">
                <h1 className="ar-header__title">Attendance Records</h1>
                <p className="ar-header__subtitle">
                  Track and manage employee attendance records
                </p>
              </div>
              <div className="ar-header__actions">
                <button className="ar-btn ar-btn--secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export Records
                </button>
                <button className="ar-btn ar-btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  View Calendar
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="ar-controls">
              <div className="ar-search-field">
                <svg className="ar-search-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search by employee name, ID, or department..."
                  className="ar-search-field__input"
                />
              </div>
              <div className="ar-filters">
                <select className="ar-select">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>HR</option>
                  <option>Sales</option>
                  <option>Marketing</option>
                </select>
                <select className="ar-select">
                  <option>All Status</option>
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Late</option>
                  <option>Early Leave</option>
                </select>
                <select className="ar-select">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Quarter</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>

            {/* Content */}
            <div className="ar-card">
              <div className="ar-card__content">
                <div className="ar-empty-state">
                  <div className="ar-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                  </div>
                  <h2 className="ar-empty-state__title">No Attendance Records</h2>
                  <p className="ar-empty-state__message">
                    Start tracking attendance records to see them here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QuickAccess />
      </div>
    </div>
  );
};

export default AttendanceRecords;
