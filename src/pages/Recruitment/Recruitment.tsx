import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import './RecruitmentShared.css';
import { useSidebar } from '../../contexts/SidebarContext';

const Recruitment: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="recruitment-page">
      <Sidebar />
      <div className={`main-content ${isCollapsed ? 'main-content--collapsed' : ''}`}>
        <div className={`navbar ${isCollapsed ? 'navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="content">
          <div className="content-container">
            <div className="header">
              <div className="header__left">
                <h1>Recruitment</h1>
                <p>Manage overall recruitment process and activities</p>
              </div>
              <div className="header__actions">
                <button className="btn btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  New Recruitment
                </button>
              </div>
            </div>
            
            <div className="filters">
              <div className="search">
                <input
                  type="text"
                  placeholder="Search recruitment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="content-body">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Recruitments</h3>
                  <div className="stat-value">45</div>
                  <p>Active recruitment processes</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Approvals</h3>
                  <div className="stat-value">12</div>
                  <p>Waiting for management approval</p>
                </div>
                <div className="stat-card">
                  <h3>Completed</h3>
                  <div className="stat-value">128</div>
                  <p>Successfully filled positions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <QuickAccess />
    </div>
  );
};

export default Recruitment;
