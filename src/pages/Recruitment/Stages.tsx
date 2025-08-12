import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './RecruitmentShared.css';

const Stages: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="stages-page">
      <Sidebar />
      <div className={`main-content ${isCollapsed ? 'main-content--collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="content">
          <div className="content-container">
            {/* Header */}
            <div className="header">
              <div className="header__left">
                <h1>Recruitment Stages</h1>
                <p>Configure and manage recruitment workflow stages</p>
              </div>
              <div className="header__actions">
                <button className="btn btn--secondary">
                  <span>Reset to Default</span>
                </button>
                <button className="btn btn--primary">
                  <span>Add Stage</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="content-body">
              <div className="stages-list">
                <div className="stage-item">
                  <div className="stage-number">1</div>
                  <div className="stage-content">
                    <h3>Application Review</h3>
                    <p>Initial screening of candidate applications and resumes</p>
                    <span className="stage-duration">Duration: 2-3 business days</span>
                  </div>
                  <div className="stage-actions">
                    <button className="btn-small">Edit</button>
                    <button className="btn-small">Configure</button>
                  </div>
                </div>

                <div className="stage-item">
                  <div className="stage-number">2</div>
                  <div className="stage-content">
                    <h3>Phone Screening</h3>
                    <p>Brief phone interview to assess basic qualifications</p>
                    <span className="stage-duration">Duration: 30 minutes</span>
                  </div>
                  <div className="stage-actions">
                    <button className="btn-small">Edit</button>
                    <button className="btn-small">Configure</button>
                  </div>
                </div>

                <div className="stage-item">
                  <div className="stage-number">3</div>
                  <div className="stage-content">
                    <h3>Technical Assessment</h3>
                    <p>Skills-based evaluation and coding challenges</p>
                    <span className="stage-duration">Duration: 1-2 hours</span>
                  </div>
                  <div className="stage-actions">
                    <button className="btn-small">Edit</button>
                    <button className="btn-small">Configure</button>
                  </div>
                </div>

                <div className="stage-item">
                  <div className="stage-number">4</div>
                  <div className="stage-content">
                    <h3>Team Interview</h3>
                    <p>In-depth interview with team members and managers</p>
                    <span className="stage-duration">Duration: 1 hour</span>
                  </div>
                  <div className="stage-actions">
                    <button className="btn-small">Edit</button>
                    <button className="btn-small">Configure</button>
                  </div>
                </div>

                <div className="stage-item">
                  <div className="stage-number">5</div>
                  <div className="stage-content">
                    <h3>Final Interview</h3>
                    <p>Final round with senior leadership and cultural fit assessment</p>
                    <span className="stage-duration">Duration: 45 minutes</span>
                  </div>
                  <div className="stage-actions">
                    <button className="btn-small">Edit</button>
                    <button className="btn-small">Configure</button>
                  </div>
                </div>

                <div className="stage-item">
                  <div className="stage-number">6</div>
                  <div className="stage-content">
                    <h3>Reference Check</h3>
                    <p>Verification of candidate background and references</p>
                    <span className="stage-duration">Duration: 1-2 business days</span>
                  </div>
                  <div className="stage-actions">
                    <button className="btn-small">Edit</button>
                    <button className="btn-small">Configure</button>
                  </div>
                </div>

                <div className="stage-item">
                  <div className="stage-number">7</div>
                  <div className="stage-content">
                    <h3>Offer Negotiation</h3>
                    <p>Job offer presentation and salary negotiation</p>
                    <span className="stage-duration">Duration: 3-5 business days</span>
                  </div>
                  <div className="stage-actions">
                    <button className="btn-small">Edit</button>
                    <button className="btn-small">Configure</button>
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

export default Stages;
