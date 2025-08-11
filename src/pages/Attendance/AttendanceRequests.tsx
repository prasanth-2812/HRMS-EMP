import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './AttendanceRequests.css';
import AttendanceRequestModal from '../../components/QuickAccess/modals/AttendanceRequestModal';

const AttendanceRequests: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="attendance-requests-page">
      <Sidebar />
      <div className={`areq-main-content ${isCollapsed ? 'areq-main-content--collapsed' : ''}`}>
        <div className={`areq-navbar ${isCollapsed ? 'areq-navbar--collapsed' : ''}`}>
          <Navbar pageTitle="Attendance Requests" />
        </div>
        <div className="areq-content">
          <div className="areq-content-container">
            {/* Page Header */}
            <div className="areq-header">
              <div className="areq-header__left">
                <h1 className="areq-header__title">All Attendances</h1>
              </div>
              <div className="areq-header__actions">
                <button
                  className="areq-btn areq-btn--primary"
                  onClick={() => setShowModal(true)}
                >
                  + Create
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="areq-card">
              <div className="areq-card__content">
                <div className="areq-empty-state">
                  <div className="areq-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="m15 9-6 6"></path>
                      <path d="m9 9 6 6"></path>
                    </svg>
                  </div>
                  <h2 className="areq-empty-state__title">No Records found.</h2>
                  <p className="areq-empty-state__message">
                    There are no attendance requests to display.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QuickAccess />
        {/* Attendance Request Modal */}
        {showModal && (
          <div className="areq-modal-overlay">
            <div className="areq-modal">
              <AttendanceRequestModal isOpen={showModal} onClose={() => setShowModal(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRequests;
