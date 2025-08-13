import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './LeaveApplications.css';

const LeaveApplications: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="leave-applications-page">
      <Sidebar />
      <div className={`la-main-content ${isCollapsed ? 'la-main-content--collapsed' : ''}`}>
        <div className={`la-navbar ${isCollapsed ? 'la-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="la-content">
          <div className="la-content-container">
            {/* Header Section */}
            <div className="la-header">
              <div className="la-header__left">
                <h1 className="la-header__title">Leave Applications</h1>
                <p className="la-header__subtitle">Manage employee leave requests and approvals</p>
              </div>
              <div className="la-header__actions">
                <button className="la-btn la-btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Apply Leave
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="la-card">
              <div className="la-card__content">
                <p className="la-placeholder">Leave applications management coming soon...</p>
              </div>
            </div>
          </div>
        </div>
        <QuickAccess />
      </div>
    </div>
  );
};

export default LeaveApplications;
