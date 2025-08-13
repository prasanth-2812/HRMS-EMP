import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './RecruitmentShared.css';

const OpenJobs: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="open-jobs-page">
      <Sidebar />
      <div className={`main-content ${isCollapsed ? 'main-content--collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="content">
          <div className="content-container">
            {/* Header */}
            <div className="header">
              <div className="header__left">
                <h1>Open Jobs</h1>
                <p>Manage active job postings and requirements</p>
              </div>
              <div className="header__actions">
                <button className="btn btn--secondary">
                  <span>Import Jobs</span>
                </button>
                <button className="btn btn--primary">
                  <span>Post New Job</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="filters">
              <div className="search">
                <input 
                  type="text" 
                  placeholder="Search job titles, departments..." 
                  className="search-input"
                />
              </div>
              <div className="filter-buttons">
                <button className="filter-btn filter-btn--active">All Jobs</button>
                <button className="filter-btn">Urgent</button>
                <button className="filter-btn">Remote</button>
                <button className="filter-btn">On-site</button>
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="jobs-grid">
              <div className="job-card">
                <div className="job-header">
                  <h3>Frontend Developer</h3>
                  <span className="job-badge job-badge--urgent">Urgent</span>
                </div>
                <div className="job-department">Engineering • React Team</div>
                <div className="job-location">Remote / San Francisco, CA</div>
                <div className="job-footer">
                  <span className="job-applicants">42 applicants</span>
                  <span className="job-posted">Posted 5 days ago</span>
                </div>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <h3>Backend Developer</h3>
                  <span className="job-badge job-badge--active">Active</span>
                </div>
                <div className="job-department">Engineering • API Team</div>
                <div className="job-location">San Francisco, CA</div>
                <div className="job-footer">
                  <span className="job-applicants">28 applicants</span>
                  <span className="job-posted">Posted 2 days ago</span>
                </div>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <h3>Product Manager</h3>
                  <span className="job-badge job-badge--active">Active</span>
                </div>
                <div className="job-department">Product • Growth Team</div>
                <div className="job-location">New York, NY</div>
                <div className="job-footer">
                  <span className="job-applicants">65 applicants</span>
                  <span className="job-posted">Posted 1 week ago</span>
                </div>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <h3>UX Designer</h3>
                  <span className="job-badge job-badge--urgent">Urgent</span>
                </div>
                <div className="job-department">Design • User Experience</div>
                <div className="job-location">Remote / Austin, TX</div>
                <div className="job-footer">
                  <span className="job-applicants">35 applicants</span>
                  <span className="job-posted">Posted 3 days ago</span>
                </div>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <h3>Data Scientist</h3>
                  <span className="job-badge job-badge--active">Active</span>
                </div>
                <div className="job-department">Data • Analytics Team</div>
                <div className="job-location">Boston, MA</div>
                <div className="job-footer">
                  <span className="job-applicants">19 applicants</span>
                  <span className="job-posted">Posted 4 days ago</span>
                </div>
              </div>

              <div className="job-card">
                <div className="job-header">
                  <h3>DevOps Engineer</h3>
                  <span className="job-badge job-badge--active">Active</span>
                </div>
                <div className="job-department">Infrastructure • Platform</div>
                <div className="job-location">Seattle, WA</div>
                <div className="job-footer">
                  <span className="job-applicants">23 applicants</span>
                  <span className="job-posted">Posted 6 days ago</span>
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

export default OpenJobs;
