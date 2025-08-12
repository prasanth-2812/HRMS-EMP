import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './JobPostings.css';

const JobPostings: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="job-postings-page">
      <Sidebar />
      <div className={`jp-main-content ${isCollapsed ? 'jp-main-content--collapsed' : ''}`}>
        <div className={`jp-navbar ${isCollapsed ? 'jp-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="jp-content">
          <div className="jp-content-container">
            {/* Header Section */}
            <div className="jp-header">
              <div className="jp-header__left">
                <h1 className="jp-header__title">Job Postings</h1>
                <p className="jp-header__subtitle">Create and manage job openings</p>
              </div>
              <div className="jp-header__actions">
                <button className="jp-btn jp-btn--secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Templates
                </button>
                <button className="oh-btn oh-btn--primary">
                  <svg className="oh-btn__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create Job Posting
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
                  placeholder="Search job postings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="oh-filters">
                <select className="oh-select">
                  <option value="">All Departments</option>
                  <option value="engineering">Engineering</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                </select>
                <select className="oh-select">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Job Postings Content */}
            <div className="oh-card">
              <div className="oh-card__content">
                <div className="oh-empty-state">
                  <div className="oh-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <h3 className="oh-empty-state__title">No job postings found</h3>
                  <p className="oh-empty-state__message">
                    Create your first job posting to start attracting candidates.
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

export default JobPostings;
