import React, { useState } from 'react';
import SendMail from './modals/sendMail';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './AttendanceDashboard.css';

const AttendanceDashboard: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [selectedDate, setSelectedDate] = useState('05-08-20');
  const [selectedMonth, setSelectedMonth] = useState('August, 2025');
  const [mailModalOpen, setMailModalOpen] = useState(false);

  return (
    <div className="attendance-dashboard-page">
      <Sidebar />
      <div className={`ad-main-content ${isCollapsed ? 'ad-main-content--collapsed' : ''}`}>
        <div className={`ad-navbar ${isCollapsed ? 'ad-navbar--collapsed' : ''}`}>
          <Navbar pageTitle="Attendance Dashboard" />
        </div>
        <div className="ad-content">
          <div className="ad-content-container">
            {/* Top Statistics Cards */}
            <div className="ad-stats-grid">
              <div className="ad-stat-card ad-stat-card--blue">
                <div className="ad-stat-card__header">
                  <h3 className="ad-stat-card__title">Today's Attendances</h3>
                </div>
                <div className="ad-stat-card__content">
                  <div className="ad-stat-card__value">0.00%</div>
                  <div className="ad-stat-card__progress">
                    <div className="ad-progress-bar">
                      <div className="ad-progress-bar__fill ad-progress-bar__fill--blue" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ad-stat-card ad-stat-card--green">
                <div className="ad-stat-card__header">
                  <h3 className="ad-stat-card__title">On Time</h3>
                </div>
                <div className="ad-stat-card__content">
                  <div className="ad-stat-card__value">0</div>
                  <div className="ad-stat-card__progress">
                    <div className="ad-progress-bar">
                      <div className="ad-progress-bar__fill ad-progress-bar__fill--green" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ad-stat-card ad-stat-card--red">
                <div className="ad-stat-card__header">
                  <h3 className="ad-stat-card__title">Late Come</h3>
                </div>
                <div className="ad-stat-card__content">
                  <div className="ad-stat-card__value">0</div>
                  <div className="ad-stat-card__progress">
                    <div className="ad-progress-bar">
                      <div className="ad-progress-bar__fill ad-progress-bar__fill--red" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Status Cards */}
            <div className="ad-additional-cards-grid">
              <div className="ad-status-card">
                <div className="ad-status-card__header">
                  <h3 className="ad-status-card__title">On Break</h3>
                </div>
                <div className="ad-status-card__content">
                  <div className="ad-empty-state">
                    <div className="ad-empty-state__icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M12 2v10l4 4"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                      </svg>
                    </div>
                    <p className="ad-empty-state__text">No employees are currently taking a break.</p>
                  </div>
                </div>
              </div>

              <div className="ad-status-card">
                <div className="ad-status-card__header">
                  <h3 className="ad-status-card__title">Overtime To Approve</h3>
                </div>
                <div className="ad-status-card__content">
                  <div className="ad-empty-state">
                    <div className="ad-empty-state__icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                      </svg>
                    </div>
                    <div className="ad-empty-state__content">
                      <h4 className="ad-empty-state__title">No Records found.</h4>
                      <p className="ad-empty-state__text">No overtime records pending validation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Cards */}
            <div className="ad-bottom-cards-grid">
              <div className="ad-status-card">
                <div className="ad-status-card__header">
                  <h3 className="ad-status-card__title">Attendance To Validate</h3>
                </div>
                <div className="ad-status-card__content">
                  <div className="ad-empty-state">
                    <div className="ad-empty-state__icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M9 12l2 2 4-4"></path>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                        <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                        <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
                      </svg>
                    </div>
                    <p className="ad-empty-state__text">All attendance records are validated.</p>
                  </div>
                </div>
              </div>

              <div className="ad-status-card">
                <div className="ad-status-card__header">
                  <h3 className="ad-status-card__title">Department Overtime Chart</h3>
                  <div className="ad-status-card__controls">
                    <select className="ad-select" defaultValue="Day">
                      <option value="Day">Day</option>
                      <option value="Week">Week</option>
                      <option value="Month">Month</option>
                    </select>
                    <input 
                      type="date"
                      className="ad-date-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />

                  </div>
                </div>
                <div className="ad-status-card__content">
                  <div className="ad-empty-state">
                    <div className="ad-empty-state__icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M3 3v18h18"></path>
                        <path d="M7 12l4-4 4 4 6-6"></path>
                      </svg>
                    </div>
                    <p className="ad-empty-state__text">No overtime data available.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Sections */}
            <div className="ad-dashboard-grid">
              {/* Attendance Analytic */}
              <div className="ad-dashboard-card">
                <div className="ad-dashboard-card__header">
                  <h3 className="ad-dashboard-card__title">Attendance Analytic</h3>
                  <div className="ad-dashboard-card__controls">
                    <select 
                      className="ad-select"
                      value="Day"
                      onChange={(e) => {}}
                    >
                      <option value="Day">Day</option>
                      <option value="Week">Week</option>
                      <option value="Month">Month</option>
                    </select>
                    <input 
                      type="date"
                      className="ad-date-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="ad-dashboard-card__content">
                  <div className="ad-empty-chart">
                    <div className="ad-empty-chart__icon">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M3 3v18h18"></path>
                        <path d="M7 12l4-4 4 4 6-6"></path>
                      </svg>
                    </div>
                    <p className="ad-empty-chart__text">No records available at the moment.</p>
                  </div>
                </div>
              </div>

              {/* Offline Employees */}
              <div className="ad-dashboard-card">
                <div className="ad-dashboard-card__header">
                  <h3 className="ad-dashboard-card__title">Offline Employees</h3>
                </div>
                <div className="ad-dashboard-card__content">
                  <div className="ad-employee-list">
                    <div className="ad-employee-item">
                      <div className="ad-employee-avatar">
                        <div className="ad-avatar-img ad-avatar-placeholder">TS</div>
                      </div>
                      <div className="ad-employee-info">
                        <div className="ad-employee-name">tarun sai</div>
                        <div className="ad-employee-status">Restricted working</div>
                      </div>
                      <div className="ad-employee-actions">
                        <button className="ad-icon-btn" onClick={() => setMailModalOpen(true)} title="Send Mail">
                          {/* Mail icon (envelope) */}
                          <span role="img" aria-label="mail">✉️</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours Chart */}
              <div className="ad-dashboard-card">
                <div className="ad-dashboard-card__header">
                  <h3 className="ad-dashboard-card__title">Hours Chart</h3>
                  <div className="ad-dashboard-card__controls">
                    <input 
                      type="date"
                      className="ad-date-input"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                  </div>
                </div>
                <div className="ad-dashboard-card__content">
                  <div className="ad-empty-chart">
                    <div className="ad-empty-chart__icon">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                      </svg>
                    </div>
                    <p className="ad-empty-chart__text">No records available at the moment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QuickAccess />
        {/* SendMail Modal */}
        <SendMail
          open={mailModalOpen}
          onClose={() => setMailModalOpen(false)}
          employee={{ name: 'tarun sai', avatar: 'TS' }}
        />
      </div>
    </div>
  );
};

export default AttendanceDashboard;
