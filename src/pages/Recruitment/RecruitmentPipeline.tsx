import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './RecruitmentPipeline.css';

const RecruitmentPipeline: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="recruitment-pipeline-page">
      <Sidebar />
      <div className={`rp-main-content ${isCollapsed ? 'rp-main-content--collapsed' : ''}`}>
        <div className={`rp-navbar ${isCollapsed ? 'rp-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="rp-content">
          <div className="rp-content-container">
            {/* Header Section */}
            <div className="rp-header">
              <div className="rp-header__left">
                <h1 className="rp-header__title">Recruitment Pipeline</h1>
                <p className="rp-header__subtitle">Track and manage recruitment stages and candidate flow</p>
              </div>
              <div className="rp-header__actions">
                <button className="rp-btn rp-btn--secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4"></path>
                  </svg>
                  Export Pipeline
                </button>
                <button className="rp-btn rp-btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create Pipeline
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="rp-filters">
              <div className="rp-search">
                <div className="rp-search__input-group">
                  <svg className="rp-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="rp-search__input"
                    placeholder="Search pipelines..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="rp-filter-buttons">
                <button className="rp-filter-btn rp-filter-btn--active">All Pipelines</button>
                <button className="rp-filter-btn">Active</button>
                <button className="rp-filter-btn">Inactive</button>
                <button className="rp-filter-btn">Completed</button>
              </div>
            </div>

            {/* Pipeline Content */}
            <div className="rp-content-body">
              <div className="rp-pipeline-board">
                <div className="rp-pipeline-column">
                  <div className="rp-column-header">
                    <h3 className="rp-column-title">Applied</h3>
                    <span className="rp-column-count">15</span>
                  </div>
                  <div className="rp-column-content">
                    <div className="rp-pipeline-card">
                      <div className="rp-card-header">
                        <h4>Senior Software Engineer</h4>
                        <span className="rp-card-badge">New</span>
                      </div>
                      <p className="rp-card-description">5 candidates in pipeline</p>
                      <div className="rp-card-footer">
                        <span className="rp-card-date">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rp-pipeline-column">
                  <div className="rp-column-header">
                    <h3 className="rp-column-title">Screening</h3>
                    <span className="rp-column-count">8</span>
                  </div>
                  <div className="rp-column-content">
                    <div className="rp-pipeline-card">
                      <div className="rp-card-header">
                        <h4>Marketing Manager</h4>
                        <span className="rp-card-badge rp-card-badge--progress">In Progress</span>
                      </div>
                      <p className="rp-card-description">3 candidates in screening</p>
                      <div className="rp-card-footer">
                        <span className="rp-card-date">1 day ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rp-pipeline-column">
                  <div className="rp-column-header">
                    <h3 className="rp-column-title">Interview</h3>
                    <span className="rp-column-count">12</span>
                  </div>
                  <div className="rp-column-content">
                    <div className="rp-pipeline-card">
                      <div className="rp-card-header">
                        <h4>UX Designer</h4>
                        <span className="rp-card-badge rp-card-badge--interview">Interview</span>
                      </div>
                      <p className="rp-card-description">4 candidates scheduled</p>
                      <div className="rp-card-footer">
                        <span className="rp-card-date">Today</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rp-pipeline-column">
                  <div className="rp-column-header">
                    <h3 className="rp-column-title">Offer</h3>
                    <span className="rp-column-count">3</span>
                  </div>
                  <div className="rp-column-content">
                    <div className="rp-pipeline-card">
                      <div className="rp-card-header">
                        <h4>Data Analyst</h4>
                        <span className="rp-card-badge rp-card-badge--offer">Offer Made</span>
                      </div>
                      <p className="rp-card-description">1 candidate pending</p>
                      <div className="rp-card-footer">
                        <span className="rp-card-date">3 hours ago</span>
                      </div>
                    </div>
                  </div>
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

export default RecruitmentPipeline;
