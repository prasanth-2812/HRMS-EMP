import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './Interview.css';

const Interview: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="interview-page">
      <Sidebar />
      <div className={`iv-main-content ${isCollapsed ? 'iv-main-content--collapsed' : ''}`}>
        <div className={`iv-navbar ${isCollapsed ? 'iv-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="iv-content">
          <div className="iv-content-container">
            {/* Header Section */}
            <div className="iv-header">
              <div className="iv-header__left">
                <h1 className="iv-header__title">Interview Management</h1>
                <p className="iv-header__subtitle">Schedule and manage candidate interviews</p>
              </div>
              <div className="iv-header__actions">
                <button className="iv-btn iv-btn--secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  View Calendar
                </button>
                <button className="iv-btn iv-btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Schedule Interview
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="iv-filters">
              <div className="iv-search">
                <div className="iv-search__input-group">
                  <svg className="iv-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="iv-search__input"
                    placeholder="Search interviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="iv-filter-buttons">
                <button className="iv-filter-btn iv-filter-btn--active">All Interviews</button>
                <button className="iv-filter-btn">Today</button>
                <button className="iv-filter-btn">This Week</button>
                <button className="iv-filter-btn">Upcoming</button>
              </div>
            </div>

            {/* Interview List */}
            <div className="iv-content-body">
              <div className="iv-interview-list">
                <div className="iv-interview-card">
                  <div className="iv-card-left">
                    <div className="iv-candidate-info">
                      <div className="iv-candidate-avatar">JD</div>
                      <div className="iv-candidate-details">
                        <h3 className="iv-candidate-name">John Davis</h3>
                        <p className="iv-candidate-position">Senior Software Engineer</p>
                      </div>
                    </div>
                  </div>
                  <div className="iv-card-center">
                    <div className="iv-interview-details">
                      <div className="iv-interview-type">
                        <span className="iv-type-badge iv-type-badge--technical">Technical Interview</span>
                      </div>
                      <div className="iv-interview-time">
                        <span className="iv-time">Today, 2:00 PM - 3:00 PM</span>
                        <span className="iv-duration">1 hour</span>
                      </div>
                      <div className="iv-interviewer">
                        <span className="iv-interviewer-name">Sarah Wilson (Lead Developer)</span>
                      </div>
                    </div>
                  </div>
                  <div className="iv-card-right">
                    <div className="iv-status">
                      <span className="iv-status-badge iv-status-badge--scheduled">Scheduled</span>
                    </div>
                    <div className="iv-actions">
                      <button className="iv-action-btn iv-action-btn--primary">Join</button>
                      <button className="iv-action-btn iv-action-btn--secondary">Reschedule</button>
                    </div>
                  </div>
                </div>

                <div className="iv-interview-card">
                  <div className="iv-card-left">
                    <div className="iv-candidate-info">
                      <div className="iv-candidate-avatar">SM</div>
                      <div className="iv-candidate-details">
                        <h3 className="iv-candidate-name">Sarah Miller</h3>
                        <p className="iv-candidate-position">Marketing Manager</p>
                      </div>
                    </div>
                  </div>
                  <div className="iv-card-center">
                    <div className="iv-interview-details">
                      <div className="iv-interview-type">
                        <span className="iv-type-badge iv-type-badge--hr">HR Interview</span>
                      </div>
                      <div className="iv-interview-time">
                        <span className="iv-time">Tomorrow, 10:00 AM - 11:00 AM</span>
                        <span className="iv-duration">1 hour</span>
                      </div>
                      <div className="iv-interviewer">
                        <span className="iv-interviewer-name">Mike Johnson (HR Manager)</span>
                      </div>
                    </div>
                  </div>
                  <div className="iv-card-right">
                    <div className="iv-status">
                      <span className="iv-status-badge iv-status-badge--confirmed">Confirmed</span>
                    </div>
                    <div className="iv-actions">
                      <button className="iv-action-btn iv-action-btn--primary">Join</button>
                      <button className="iv-action-btn iv-action-btn--secondary">Reschedule</button>
                    </div>
                  </div>
                </div>

                <div className="iv-interview-card">
                  <div className="iv-card-left">
                    <div className="iv-candidate-info">
                      <div className="iv-candidate-avatar">AJ</div>
                      <div className="iv-candidate-details">
                        <h3 className="iv-candidate-name">Alex Johnson</h3>
                        <p className="iv-candidate-position">UX Designer</p>
                      </div>
                    </div>
                  </div>
                  <div className="iv-card-center">
                    <div className="iv-interview-details">
                      <div className="iv-interview-type">
                        <span className="iv-type-badge iv-type-badge--final">Final Interview</span>
                      </div>
                      <div className="iv-interview-time">
                        <span className="iv-time">Aug 6, 3:00 PM - 4:30 PM</span>
                        <span className="iv-duration">1.5 hours</span>
                      </div>
                      <div className="iv-interviewer">
                        <span className="iv-interviewer-name">Emily Davis (Design Director)</span>
                      </div>
                    </div>
                  </div>
                  <div className="iv-card-right">
                    <div className="iv-status">
                      <span className="iv-status-badge iv-status-badge--pending">Pending</span>
                    </div>
                    <div className="iv-actions">
                      <button className="iv-action-btn iv-action-btn--secondary">Edit</button>
                      <button className="iv-action-btn iv-action-btn--secondary">Cancel</button>
                    </div>
                  </div>
                </div>

                <div className="iv-interview-card iv-interview-card--completed">
                  <div className="iv-card-left">
                    <div className="iv-candidate-info">
                      <div className="iv-candidate-avatar">RM</div>
                      <div className="iv-candidate-details">
                        <h3 className="iv-candidate-name">Robert Martinez</h3>
                        <p className="iv-candidate-position">Data Analyst</p>
                      </div>
                    </div>
                  </div>
                  <div className="iv-card-center">
                    <div className="iv-interview-details">
                      <div className="iv-interview-type">
                        <span className="iv-type-badge iv-type-badge--phone">Phone Screening</span>
                      </div>
                      <div className="iv-interview-time">
                        <span className="iv-time">Yesterday, 1:00 PM - 1:30 PM</span>
                        <span className="iv-duration">30 minutes</span>
                      </div>
                      <div className="iv-interviewer">
                        <span className="iv-interviewer-name">Lisa Thompson (Recruiter)</span>
                      </div>
                    </div>
                  </div>
                  <div className="iv-card-right">
                    <div className="iv-status">
                      <span className="iv-status-badge iv-status-badge--completed">Completed</span>
                    </div>
                    <div className="iv-actions">
                      <button className="iv-action-btn iv-action-btn--primary">View Feedback</button>
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

export default Interview;
