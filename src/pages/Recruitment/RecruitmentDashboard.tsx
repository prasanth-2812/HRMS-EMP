import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './RecruitmentDashboard.css';

const RecruitmentDashboard: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="recruitment-dashboard">
      <Sidebar />
      <div className={`rd-main-content ${isCollapsed ? 'rd-main-content--collapsed' : ''}`}>
        <div className={`rd-navbar ${isCollapsed ? 'rd-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="rd-content">
          <div className="rd-content-container">
            {/* Header Section */}
            <div className="rd-header">
              <div className="rd-header__left">
                <h1 className="rd-header__title">Recruitment Dashboard</h1>
                <p className="rd-header__subtitle">Manage recruitment process and track hiring metrics</p>
              </div>
              <div className="rd-header__actions">
                <button className="rd-btn rd-btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Post New Job
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="rd-stats-grid">
              <div className="rd-stat-card">
                <div className="rd-stat-card__header">
                  <h3 className="rd-stat-card__title">Open Positions</h3>
                  <div className="rd-stat-card__icon">🎯</div>
                </div>
                <div className="rd-stat-card__content">
                  <div className="rd-stat-card__value">15</div>
                  <div className="rd-stat-card__change rd-stat-card__change--positive">+3 this week</div>
                </div>
              </div>
              
              <div className="rd-stat-card">
                <div className="rd-stat-card__header">
                  <h3 className="rd-stat-card__title">Applications</h3>
                  <div className="rd-stat-card__icon">📝</div>
                </div>
                <div className="rd-stat-card__content">
                  <div className="rd-stat-card__value">127</div>
                  <div className="rd-stat-card__change rd-stat-card__change--positive">+23 this week</div>
                </div>
              </div>
              
              <div className="rd-stat-card">
                <div className="rd-stat-card__header">
                  <h3 className="rd-stat-card__title">Interviews</h3>
                  <div className="rd-stat-card__icon">🎤</div>
                </div>
                <div className="rd-stat-card__content">
                  <div className="rd-stat-card__value">8</div>
                  <div className="rd-stat-card__change">Scheduled this week</div>
                </div>
              </div>
              
              <div className="rd-stat-card">
                <div className="rd-stat-card__header">
                  <h3 className="rd-stat-card__title">Offers Made</h3>
                  <div className="rd-stat-card__icon">🤝</div>
                </div>
                <div className="rd-stat-card__content">
                  <div className="rd-stat-card__value">3</div>
                  <div className="rd-stat-card__change rd-stat-card__change--positive">2 accepted</div>
                </div>
              </div>
            </div>
            
            {/* Content Grid */}
            <div className="rd-content-grid">
              <div className="rd-card">
                <div className="rd-card__header">
                  <h3 className="rd-card__title">Recent Job Postings</h3>
                </div>
                <div className="rd-card__content">
                  <div className="rd-job-list">
                    <div className="rd-job-item">
                      <div className="rd-job-item__content">
                        <h4 className="rd-job-item__title">Senior Software Engineer</h4>
                        <p className="rd-job-item__meta">Engineering • Posted 2 days ago</p>
                        <div className="rd-job-item__badges">
                          <span className="rd-badge rd-badge--info">15 Applications</span>
                          <span className="rd-badge rd-badge--success">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rd-job-item">
                      <div className="rd-job-item__content">
                        <h4 className="rd-job-item__title">Marketing Manager</h4>
                        <p className="rd-job-item__meta">Marketing • Posted 5 days ago</p>
                        <div className="rd-job-item__badges">
                          <span className="rd-badge rd-badge--info">8 Applications</span>
                          <span className="rd-badge rd-badge--success">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rd-job-item">
                      <div className="rd-job-item__content">
                        <h4 className="rd-job-item__title">UX Designer</h4>
                        <p className="rd-job-item__meta">Design • Posted 1 week ago</p>
                        <div className="rd-job-item__badges">
                          <span className="rd-badge rd-badge--info">22 Applications</span>
                          <span className="rd-badge rd-badge--warning">Reviewing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rd-card">
                <div className="rd-card__header">
                  <h3 className="rd-card__title">Recent Candidates</h3>
                </div>
                <div className="rd-card__content">
                  <div className="rd-candidate-list">
                    <div className="rd-candidate-item">
                      <div className="rd-candidate-item__avatar">JD</div>
                      <div className="rd-candidate-item__info">
                        <h4 className="rd-candidate-item__name">John Davis</h4>
                        <p className="rd-candidate-item__meta">Applied for Senior Software Engineer</p>
                      </div>
                      <span className="rd-badge rd-badge--warning">Interview</span>
                    </div>
                    
                    <div className="rd-candidate-item">
                      <div className="rd-candidate-item__avatar">SM</div>
                      <div className="rd-candidate-item__info">
                        <h4 className="rd-candidate-item__name">Sarah Miller</h4>
                        <p className="rd-candidate-item__meta">Applied for Marketing Manager</p>
                      </div>
                      <span className="rd-badge rd-badge--info">Review</span>
                    </div>
                    
                    <div className="rd-candidate-item">
                      <div className="rd-candidate-item__avatar">AJ</div>
                      <div className="rd-candidate-item__info">
                        <h4 className="rd-candidate-item__name">Alex Johnson</h4>
                        <p className="rd-candidate-item__meta">Applied for UX Designer</p>
                      </div>
                      <span className="rd-badge rd-badge--success">Shortlisted</span>
                    </div>
                  </div>
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

export default RecruitmentDashboard;
