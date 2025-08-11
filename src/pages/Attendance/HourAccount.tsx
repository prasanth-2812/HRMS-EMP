
import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './HourAccount.css';
import HourAccountForm from './modals/HourAccountForm';

const HourAccount: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="hour-account-page">
      <Sidebar />
      <div className={`ha-main-content ${isCollapsed ? 'ha-main-content--collapsed' : ''}`}>
        <div className={`ha-navbar ${isCollapsed ? 'ha-navbar--collapsed' : ''}`}>
          <Navbar pageTitle="Hour Account" />
        </div>
        <div className="ha-content ha-content--centered">
          {/* Breadcrumb */}
          <div className="ha-breadcrumb">
            <span className="ha-breadcrumb__item">Horilla</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item">attendance</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item ha-breadcrumb__item--active">attendance-overtime-view</span>
          </div>

          {/* Page Title and Create Button */}
          <div className="ha-header ha-header--space-between">
            <h1 className="ha-header__title">Hour Account</h1>
            <button
              className="ha-btn ha-btn--primary ha-create-btn"
              onClick={() => setShowModal(true)}
            >
              + Create
            </button>
          </div>

          {/* Empty State */}
          <div className="ha-empty-state ha-empty-state--centered">
            <div className="ha-empty-state__icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" stroke="#bdbdbd" strokeWidth="2" fill="none" />
                <path d="M15.5 15.5L19 19" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" />
                <circle cx="11" cy="11" r="4" stroke="#bdbdbd" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h2 className="ha-empty-state__title">No Records found.</h2>
            <p className="ha-empty-state__message">There are no attendance records to display.</p>
          </div>
        </div>
        <QuickAccess />
        {/* HourAccountForm Modal */}
        {showModal && (
          <div className="ha-modal-overlay">
            <div className="ha-modal">
              <button className="ha-modal-close-btn" onClick={() => setShowModal(false)}>&times;</button>
              <HourAccountForm />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HourAccount;
