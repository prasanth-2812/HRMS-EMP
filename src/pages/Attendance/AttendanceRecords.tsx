import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import AddAttendances from './modals/AddAttendances';
import ImportAttendances from './modals/ImportAttendances';
import './AttendanceRecords.css';

const AttendanceRecords: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [showModal, setShowModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Optional: handle form completion/close from AddAttendances
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="attendance-records-page">
      <Sidebar />
      <div className={`ar-main-content ${isCollapsed ? 'ar-main-content--collapsed' : ''}`}>
        <div className={`ar-navbar ${isCollapsed ? 'ar-navbar--collapsed' : ''}`}>
          <Navbar pageTitle="Attendances" />
        </div>
        <div className="ar-content">
          <div className="ar-content-container">
            {/* Page Header */}
            <div className="ar-header">
              <div className="ar-header__left">
                <h1 className="ar-header__title">Attendances</h1>
              </div>
              <div className="ar-header__actions" style={{ position: 'relative' }}>
                <button
                  className="ar-btn ar-btn--secondary"
                  onClick={() => setShowActions((prev) => !prev)}
                  type="button"
                >
                  Actions
                </button>
                {showActions && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    zIndex: 10,
                    minWidth: 120,
                  }}>
                    <button
                      className="ar-btn ar-btn--secondary"
                      style={{ width: '100%', border: 'none', borderRadius: 0, textAlign: 'left', padding: '10px 16px', background: 'none', boxShadow: 'none' }}
                      onClick={() => { setShowActions(false); setShowImportModal(true); }}
                      type="button"
                    >
                      Import
                    </button>
                  </div>
                )}
                <button
                  className="ar-btn ar-btn--primary"
                  onClick={() => setShowModal(true)}
                >
                  + Create
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="ar-card">
              <div className="ar-card__content">
                <div className="ar-empty-state">
                  <div className="ar-empty-state__icon">
                    {/* ... your SVG ... */}
                  </div>
                  <h2 className="ar-empty-state__title">No Records found.</h2>
                  <p className="ar-empty-state__message">
                    There are no attendance records to display.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <QuickAccess />

        {/* AddAttendances Modal */}
        {showModal && (
          <div className="ar-modal-overlay">
            <div className="ar-modal">
              <button className="ar-modal-close-btn" onClick={handleCloseModal}>&times;</button>
              <AddAttendances onClose={handleCloseModal} />
            </div>
          </div>
        )}
        {/* ImportAttendances Modal */}
        {showImportModal && (
          <div className="ar-modal-overlay">
            <div className="ar-modal">
              <button className="ar-modal-close-btn" onClick={() => setShowImportModal(false)}>&times;</button>
              <ImportAttendances />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;
