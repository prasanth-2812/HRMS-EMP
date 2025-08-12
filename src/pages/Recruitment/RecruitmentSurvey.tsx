import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './RecruitmentSurvey.css';

const RecruitmentSurvey: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="recruitment-survey-page">
      <Sidebar />
      <div className={`rs-main-content ${isCollapsed ? 'rs-main-content--collapsed' : ''}`}>
        <div className={`rs-navbar ${isCollapsed ? 'rs-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="rs-content">
          <div className="rs-content-container">
            {/* Header Section */}
            <div className="rs-header">
              <div className="rs-header__left">
                <h1 className="rs-header__title">Recruitment Survey</h1>
                <p className="rs-header__subtitle">Create and manage recruitment surveys and feedback forms</p>
              </div>
              <div className="rs-header__actions">
                <button className="rs-btn rs-btn--secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                  </svg>
                  Export Results
                </button>
                <button className="rs-btn rs-btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create Survey
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="rs-filters">
              <div className="rs-search">
                <div className="rs-search__input-group">
                  <svg className="rs-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="rs-search__input"
                    placeholder="Search surveys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="rs-filter-buttons">
                <button className="rs-filter-btn rs-filter-btn--active">All Surveys</button>
                <button className="rs-filter-btn">Active</button>
                <button className="rs-filter-btn">Draft</button>
                <button className="rs-filter-btn">Completed</button>
              </div>
            </div>

            {/* Survey Grid */}
            <div className="rs-content-body">
              <div className="rs-survey-grid">
                <div className="rs-survey-card">
                  <div className="rs-card-header">
                    <div className="rs-card-icon">📋</div>
                    <div className="rs-card-status rs-card-status--active">Active</div>
                  </div>
                  <div className="rs-card-content">
                    <h3 className="rs-card-title">Post-Interview Feedback</h3>
                    <p className="rs-card-description">Collect feedback from candidates after interviews</p>
                    <div className="rs-card-stats">
                      <div className="rs-stat">
                        <span className="rs-stat-number">24</span>
                        <span className="rs-stat-label">Responses</span>
                      </div>
                      <div className="rs-stat">
                        <span className="rs-stat-number">89%</span>
                        <span className="rs-stat-label">Response Rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="rs-card-footer">
                    <span className="rs-card-date">Created 5 days ago</span>
                    <div className="rs-card-actions">
                      <button className="rs-action-btn">View</button>
                      <button className="rs-action-btn">Edit</button>
                    </div>
                  </div>
                </div>

                <div className="rs-survey-card">
                  <div className="rs-card-header">
                    <div className="rs-card-icon">📊</div>
                    <div className="rs-card-status rs-card-status--draft">Draft</div>
                  </div>
                  <div className="rs-card-content">
                    <h3 className="rs-card-title">Application Experience Survey</h3>
                    <p className="rs-card-description">Survey for candidates about application process</p>
                    <div className="rs-card-stats">
                      <div className="rs-stat">
                        <span className="rs-stat-number">0</span>
                        <span className="rs-stat-label">Responses</span>
                      </div>
                      <div className="rs-stat">
                        <span className="rs-stat-number">-</span>
                        <span className="rs-stat-label">Response Rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="rs-card-footer">
                    <span className="rs-card-date">Created 2 days ago</span>
                    <div className="rs-card-actions">
                      <button className="rs-action-btn">View</button>
                      <button className="rs-action-btn">Edit</button>
                    </div>
                  </div>
                </div>

                <div className="rs-survey-card">
                  <div className="rs-card-header">
                    <div className="rs-card-icon">⭐</div>
                    <div className="rs-card-status rs-card-status--completed">Completed</div>
                  </div>
                  <div className="rs-card-content">
                    <h3 className="rs-card-title">Hiring Manager Satisfaction</h3>
                    <p className="rs-card-description">Internal survey for hiring managers</p>
                    <div className="rs-card-stats">
                      <div className="rs-stat">
                        <span className="rs-stat-number">12</span>
                        <span className="rs-stat-label">Responses</span>
                      </div>
                      <div className="rs-stat">
                        <span className="rs-stat-number">100%</span>
                        <span className="rs-stat-label">Response Rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="rs-card-footer">
                    <span className="rs-card-date">Completed 1 week ago</span>
                    <div className="rs-card-actions">
                      <button className="rs-action-btn">View</button>
                      <button className="rs-action-btn">Archive</button>
                    </div>
                  </div>
                </div>

                <div className="rs-survey-card rs-create-card">
                  <div className="rs-create-content">
                    <div className="rs-create-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                    </div>
                    <h3 className="rs-create-title">Create New Survey</h3>
                    <p className="rs-create-description">Design a new recruitment survey</p>
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

export default RecruitmentSurvey;
