import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './Candidates.css';

const Candidates: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="candidates-page">
      <Sidebar />
      <div className={`cd-main-content ${isCollapsed ? 'cd-main-content--collapsed' : ''}`}>
        <div className={`cd-navbar ${isCollapsed ? 'cd-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="cd-content">
          <div className="cd-content-container">
            {/* Header Section */}
            <div className="cd-header">
              <div className="cd-header__left">
                <h1 className="cd-header__title">Candidates</h1>
                <p className="cd-header__subtitle">Manage job applicants and candidate pipeline</p>
              </div>
              <div className="cd-header__actions">
                <button className="cd-btn cd-btn--secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    <path d="M8 1v4"></path>
                    <path d="M16 1v4"></path>
                  </svg>
                  Export
                </button>
                <button className="oh-btn oh-btn--primary">
                  <svg className="oh-btn__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Candidate
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="oh-controls">
              <div className="oh-search-field">
                <svg className="oh-search-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  className="oh-search-field__input"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="oh-filters">
                <select className="oh-select">
                  <option value="">All Positions</option>
                  <option value="engineer">Software Engineer</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="manager">Project Manager</option>
                </select>
                <select className="oh-select">
                  <option value="">All Status</option>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                </select>
              </div>
            </div>

            {/* Candidates Content */}
            <div className="oh-card">
              <div className="oh-card__content">
                <div className="oh-empty-state">
                  <div className="oh-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <h3 className="oh-empty-state__title">No candidates found</h3>
                  <p className="oh-empty-state__message">
                    Start by adding candidates or posting job openings to attract applicants.
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

export default Candidates;
