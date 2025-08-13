import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './Myattendances.css';

const Myattendances: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="attendance-activities-page">
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
            <span className="ha-breadcrumb__item ha-breadcrumb__item--active">my-attendances</span>
          </div>

          {/* Page Title */}
          <h1 className="ha-header__title">My Attendances</h1>

          {/* Empty State */}
          <div className="ha-empty-state ha-empty-state--centered">
            <div className="ha-empty-state__icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" stroke="#bdbdbd" strokeWidth="2" fill="none" />
                <path d="M15.5 15.5L19 19" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" />
                <circle cx="11" cy="11" r="4" stroke="#bdbdbd" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h2 className="ha-empty-state__title">No Records found.</h2>
            <p className="ha-empty-state__message">There are no attendance records to display.</p>
          </div>
        </div>
        <QuickAccess />
      </div>
    </div>
  );
};

export default Myattendances;
