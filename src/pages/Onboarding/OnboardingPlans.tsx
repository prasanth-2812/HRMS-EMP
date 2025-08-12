import React from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './OnboardingPlans.css';

const OnboardingPlans: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="onboarding-plans-page">
      <Sidebar />
      <div className={`op-main-content ${isCollapsed ? 'op-main-content--collapsed' : ''}`}>
        <div className={`op-navbar ${isCollapsed ? 'op-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="op-content">
          <div className="op-content-container">
            {/* Header Section */}
            <div className="op-header">
              <div className="op-header__left">
                <h1 className="op-header__title">Onboarding Plans</h1>
                <p className="op-header__subtitle">Create and manage employee onboarding processes</p>
              </div>
              <div className="op-header__actions">
                <button className="op-btn op-btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create Plan
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="op-card">
              <div className="op-card__content">
                <p className="op-placeholder">Onboarding plans management coming soon...</p>
              </div>
            </div>
          </div>
        </div>
        <QuickAccess />
      </div>
    </div>
  );
};

export default OnboardingPlans;
