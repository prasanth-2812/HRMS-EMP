import React, { useState } from 'react';
import './QuickAccess.css';
import LeaveRequestModal from './modals/LeaveRequestModal';
import ShiftRequestModal from './modals/ShiftRequestModal';
import ReimbursementModal from './modals/ReimbursementModal';
import TicketModal from './modals/TicketModal';
import AttendanceRequestModal from './modals/AttendanceRequestModal';
import WorkTypeModal from './modals/WorkTypeModal';
import AssetRequestModal from './modals/AssetRequestModal';
import DashboardChartsModal from './modals/DashboardChartsModal';
import DocumentRequestModal from './modals/DocumentRequestModal';

export interface QuickAccessProps {}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick: (e: React.MouseEvent) => void;
}

const QuickAccess: React.FC<QuickAccessProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showWorkTypeModal, setShowWorkTypeModal] = useState(false);
  const [showReimbursementModal, setShowReimbursementModal] = useState(false);
  const [showAssetRequestModal, setShowAssetRequestModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showDashboardChartsModal, setShowDashboardChartsModal] = useState(false);
  const [showDocumentRequestModal, setShowDocumentRequestModal] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Show success notification
  const showSuccessNotification = (message: string) => {
    setNotification({ type: 'success', message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Show error notification
  const showErrorNotification = (message: string) => {
    setNotification({ type: 'error', message });
    setTimeout(() => setNotification(null), 4000);
  };

  const quickActions = [
    {
      id: 'attendance',
      label: 'Create Attendance Request',
      icon: 'time-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAttendanceModal(true);
        setIsOpen(false);
      }
    },
    {
      id: 'leave',
      label: 'Create Leave Request',
      icon: 'calendar-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowLeaveModal(true);
        setIsOpen(false);
      }
    },
    {
      id: 'shift',
      label: 'Create Shift Request',
      icon: 'swap-horizontal-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowShiftModal(true);
        setIsOpen(false);
      }
    },
    {
      id: 'worktype',
      label: 'Create Work Type',
      icon: 'briefcase-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowWorkTypeModal(true);
        setIsOpen(false);
      }
    },
    {
      id: 'reimbursement',
      label: 'Create Reimbursement',
      icon: 'receipt-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowReimbursementModal(true);
        setIsOpen(false);
      }
    },
    {
      id: 'asset',
      label: 'Create Asset Request',
      icon: 'cube-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowAssetRequestModal(true);
        setIsOpen(false);
      }
    },
    {
      id: 'ticket',
      label: 'Create Ticket',
      icon: 'help-circle-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowTicketModal(true);
        setIsOpen(false);
      }
    },
    {
      id: 'charts',
      label: 'Dashboard Charts',
      icon: 'bar-chart-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDashboardChartsModal(true);
        setIsOpen(false);
      }
    },
    {
      id: 'document',
      label: 'Request Document',
      icon: 'document-text-outline',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDocumentRequestModal(true);
        setIsOpen(false);
      }
    }
  ];

  const getIonIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      case 'time-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
        );
      case 'swap-horizontal-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 6H3"></path>
            <path d="M10 12H3"></path>
            <path d="M21 18H3"></path>
            <path d="M17 8L21 4L17 0"></path>
            <path d="M7 16L3 20L7 24"></path>
          </svg>
        );
      case 'receipt-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case 'help-circle-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        );
      case 'briefcase-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        );
      case 'cube-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        );
      case 'bar-chart-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="16"></line>
          </svg>
        );
      case 'document-text-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
        );
      case 'close-outline':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        );
      case 'add-outline':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Quick Access Container */}
      <div className="oh-quick-access">
        {/* Quick Action Menu */}
        {isOpen && (
          <div className="oh-quick-access__menu">
            {quickActions.map((action, index) => (
              <button
                key={action.id}
                className="oh-quick-access__menu-item"
                onClick={action.onClick}
                title={action.label}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {getIonIcon(action.icon)}
              </button>
            ))}
          </div>
        )}
        
        {/* Main FAB Button */}
        <button
          className={`oh-quick-access__fab ${isOpen ? 'oh-quick-access__fab--open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Quick Access Menu"
        >
          {isOpen ? getIonIcon('close-outline') : getIonIcon('add-outline')}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="oh-quick-access__backdrop" 
          onClick={(e) => {
            // Only close if clicking directly on backdrop, not on menu items
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        />
      )}

      {/* Modals */}
      <AttendanceRequestModal 
        isOpen={showAttendanceModal} 
        onClose={() => setShowAttendanceModal(false)} 
        onSuccess={showSuccessNotification}
      />
      <LeaveRequestModal 
        isOpen={showLeaveModal} 
        onClose={() => setShowLeaveModal(false)} 
        onSuccess={showSuccessNotification}
      />
      <ShiftRequestModal 
        isOpen={showShiftModal} 
        onClose={() => setShowShiftModal(false)} 
        onSuccess={showSuccessNotification}
      />
      <WorkTypeModal 
        isOpen={showWorkTypeModal} 
        onClose={() => setShowWorkTypeModal(false)} 
        onSuccess={showSuccessNotification}
      />
      <ReimbursementModal 
        isOpen={showReimbursementModal} 
        onClose={() => setShowReimbursementModal(false)} 
        onSuccess={showSuccessNotification}
      />
      <AssetRequestModal 
        isOpen={showAssetRequestModal} 
        onClose={() => setShowAssetRequestModal(false)} 
        onSuccess={showSuccessNotification}
      />
      <TicketModal 
        isOpen={showTicketModal} 
        onClose={() => setShowTicketModal(false)} 
        onSuccess={showSuccessNotification}
      />
      <DashboardChartsModal 
        isOpen={showDashboardChartsModal} 
        onClose={() => setShowDashboardChartsModal(false)} 
        onSuccess={showSuccessNotification}
      />
      <DocumentRequestModal 
        isOpen={showDocumentRequestModal} 
        onClose={() => setShowDocumentRequestModal(false)} 
        onSuccess={showSuccessNotification}
      />

      {/* Notification Toast */}
      {notification && (
        <div className={`oh-notification oh-notification--${notification.type}`}>
          <div className="oh-notification__content">
            <div className="oh-notification__icon">
              {notification.type === 'success' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
              )}
              {notification.type === 'error' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
              {notification.type === 'info' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
            </div>
            <span className="oh-notification__message">{notification.message}</span>
            <button 
              className="oh-notification__close"
              onClick={() => setNotification(null)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickAccess;
