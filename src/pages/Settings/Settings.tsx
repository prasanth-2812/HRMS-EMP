import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import GeneralSettingsForm from './components/GeneralSettingsForm';
import './Settings.css';

// Import all modal components
import GeneralSettingsModal from './modals/GeneralSettingsModal';
import EmployeePermissionModal from './modals/EmployeePermissionModal';
import AccessibilityRestrictionModal from './modals/AccessibilityRestrictionModal';
import UserGroupModal from './modals/UserGroupModal';
import DateTimeFormatModal from './modals/DateTimeFormatModal';
import HistoryTagsModal from './modals/HistoryTagsModal';
import MailServerModal from './modals/MailServerModal';
import GdriveBackupModal from './modals/GdriveBackupModal';
import DepartmentModal from './modals/DepartmentModal';
import JobPositionsModal from './modals/JobPositionsModal';
import JobRoleModal from './modals/JobRoleModal';
import CompanyModal from './modals/CompanyModal';
import CandidateSelfTrackingModal from './modals/CandidateSelfTrackingModal';
import CandidateRejectReasonModal from './modals/CandidateRejectReasonModal';
import SkillsModal from './modals/SkillsModal';
import LinkedinIntegrationModal from './modals/LinkedinIntegrationModal';
import WorkTypeModal from './modals/WorkTypeModal';
import RotatingWorkTypeModal from './modals/RotatingWorkTypeModal';
import EmployeeShiftModal from './modals/EmployeeShiftModal';
import RotatingShiftModal from './modals/RotatingShiftModal';
import EmployeeShiftScheduleModal from './modals/EmployeeShiftScheduleModal';
import EmployeeTypeModal from './modals/EmployeeTypeModal';
import DisciplinaryActionTypeModal from './modals/DisciplinaryActionTypeModal';
import EmployeeTagsModal from './modals/EmployeeTagsModal';
import TrackLateComeEarlyOutModal from './modals/TrackLateComeEarlyOutModal';
import AttendanceBreakPointModal from './modals/AttendanceBreakPointModal';
import CheckInCheckOutModal from './modals/CheckInCheckOutModal';
import GraceTimeModal from './modals/GraceTimeModal';
import BiometricAttendanceModal from './modals/BiometricAttendanceModal';
import IPRestrictionModal from './modals/IPRestrictionModal';
import GeoFaceConfigModal from './modals/GeoFaceConfigModal';
import RestrictionsModal from './modals/RestrictionsModal';
import CompensatoryLeaveModal from './modals/CompensatoryLeaveModal';
import PayslipAutoGenerationModal from './modals/PayslipAutoGenerationModal';
import BonusPointSettingModal from './modals/BonusPointSettingModal';
import DepartmentManagersModal from './modals/DepartmentManagersModal';
import TicketTypeModal from './modals/TicketTypeModal';
import HelpdeskTagsModal from './modals/HelpdeskTagsModal';

interface SettingsItem {
  id: string;
  label: string;
  category: string;
}

const Settings: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  // Modal mapping for all settings items
  const modalComponents: { [key: string]: React.ComponentType<{ onClose: () => void }> } = {
    'General Settings': GeneralSettingsModal,
    'Employee Permission': EmployeePermissionModal,
    'Accessibility Restriction': AccessibilityRestrictionModal,
    'User Group': UserGroupModal,
    'Date & Time Format': DateTimeFormatModal,
    'History Tags': HistoryTagsModal,
    'Mail Server': MailServerModal,
    'Gdrive Backup': GdriveBackupModal,
    'Department': DepartmentModal,
    'Job Positions': JobPositionsModal,
    'Job Role': JobRoleModal,
    'Company': CompanyModal,
    'Candidate Self Tracking': CandidateSelfTrackingModal,
    'Candidate Reject Reason': CandidateRejectReasonModal,
    'Skills': SkillsModal,
    'Linkedin Integration': LinkedinIntegrationModal,
    'Work Type': WorkTypeModal,
    'Rotating Work Type': RotatingWorkTypeModal,
    'Employee Shift': EmployeeShiftModal,
    'Rotating Shift': RotatingShiftModal,
    'Employee Shift Schedule': EmployeeShiftScheduleModal,
    'Employee Type': EmployeeTypeModal,
    'Disciplinary Action Type': DisciplinaryActionTypeModal,
    'Employee Tags': EmployeeTagsModal,
    'Track Late Come & Early Out': TrackLateComeEarlyOutModal,
    'Attendance Break Point': AttendanceBreakPointModal,
    'Check In/Check Out': CheckInCheckOutModal,
    'Grace Time': GraceTimeModal,
    'Biometric Attendance': BiometricAttendanceModal,
    'IP Restriction': IPRestrictionModal,
    'Geo & Face Config': GeoFaceConfigModal,
    'Restrictions': RestrictionsModal,
    'Compensatory Leave': CompensatoryLeaveModal,
    'Payslip Auto Generation': PayslipAutoGenerationModal,
    'Bonus Point Setting': BonusPointSettingModal,
    'Department Managers': DepartmentManagersModal,
    'Ticket Type': TicketTypeModal,
    'Helpdesk Tags': HelpdeskTagsModal
  };
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['General']);

  const settingsItems: SettingsItem[] = [
    // General
    { id: 'general', label: 'General Settings', category: 'General' },
    { id: 'employee-permission', label: 'Employee Permission', category: 'General' },
    { id: 'accessibility-restriction', label: 'Accessibility Restriction', category: 'General' },
    { id: 'user-group', label: 'User Group', category: 'General' },
    { id: 'date-time-format', label: 'Date & Time Format', category: 'General' },
    { id: 'history-tags', label: 'History Tags', category: 'General' },
    { id: 'mail-server', label: 'Mail Server', category: 'General' },
    { id: 'gdrive-backup', label: 'Gdrive Backup', category: 'General' },
    
    // Base
    { id: 'department', label: 'Department', category: 'Base' },
    { id: 'job-positions', label: 'Job Positions', category: 'Base' },
    { id: 'job-role', label: 'Job Role', category: 'Base' },
    { id: 'company', label: 'Company', category: 'Base' },
    
    // Recruitment
    { id: 'candidate-self-tracking', label: 'Candidate Self Tracking', category: 'Recruitment' },
    { id: 'candidate-reject-reason', label: 'Candidate Reject Reason', category: 'Recruitment' },
    { id: 'skills', label: 'Skills', category: 'Recruitment' },
    { id: 'linkedin-integration', label: 'Linkedin Integration', category: 'Recruitment' },
    
    // Employee
    { id: 'work-type', label: 'Work Type', category: 'Employee' },
    { id: 'rotating-work-type', label: 'Rotating Work Type', category: 'Employee' },
    { id: 'employee-shift', label: 'Employee Shift', category: 'Employee' },
    { id: 'rotating-shift', label: 'Rotating Shift', category: 'Employee' },
    { id: 'employee-shift-schedule', label: 'Employee Shift Schedule', category: 'Employee' },
    { id: 'employee-type', label: 'Employee Type', category: 'Employee' },
    { id: 'disciplinary-action-type', label: 'Disciplinary Action Type', category: 'Employee' },
    { id: 'employee-tags', label: 'Employee Tags', category: 'Employee' },
    
    // Attendance
    { id: 'track-late-come-early-out', label: 'Track Late Come & Early Out', category: 'Attendance' },
    { id: 'attendance-break-point', label: 'Attendance Break Point', category: 'Attendance' },
    { id: 'check-in-check-out', label: 'Check In/Check Out', category: 'Attendance' },
    { id: 'grace-time', label: 'Grace Time', category: 'Attendance' },
    { id: 'biometric-attendance', label: 'Biometric Attendance', category: 'Attendance' },
    { id: 'ip-restriction', label: 'IP Restriction', category: 'Attendance' },
    { id: 'geo-face-config', label: 'Geo & Face Config', category: 'Attendance' },
    
    // Leave
    { id: 'restrictions', label: 'Restrictions', category: 'Leave' },
    { id: 'compensatory-leave', label: 'Compensatory Leave', category: 'Leave' },
    
    // Payroll
    { id: 'payslip-auto-generation', label: 'Payslip Auto Generation', category: 'Payroll' },
    
    // Performance
    { id: 'bonus-point-setting', label: 'Bonus Point Setting', category: 'Performance' },
    
    // Help Desk
    { id: 'department-managers', label: 'Department Managers', category: 'Help Desk' },
    { id: 'ticket-type', label: 'Ticket Type', category: 'Help Desk' },
    { id: 'helpdesk-tags', label: 'Helpdesk Tags', category: 'Help Desk' },
  ];

  const categories = ['General', 'Base', 'Recruitment', 'Employee', 'Attendance', 'Leave', 'Payroll', 'Performance', 'Help Desk'];

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const openModal = (itemId: string) => {
    const item = settingsItems.find(item => item.id === itemId);
    if (item) {
      if (item.id === 'general') {
        setSelectedSetting('general');
      } else {
        setSelectedSetting(item.label);
      }
    }
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className={`settings-main-content ${isCollapsed ? 'settings-main-content--collapsed' : ''}`}>
        <div className={`settings-navbar ${isCollapsed ? 'settings-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="settings-content">
          <div className="settings-content-container">
            {/* Header Section */}
            <div className="settings-header">
              <div className="settings-header__left">
                <h1 className="settings-header__title">Settings</h1>
                <p className="settings-header__subtitle">Configure your HRMS system settings</p>
              </div>
            </div>

            {/* Settings Content */}
            <div className="settings-layout">
              <div className="settings-sidebar">
                {categories.map(category => (
                  <div key={category} className="settings-category">
                    <button
                      className={`settings-category-header ${expandedCategories.includes(category) ? 'expanded' : ''}`}
                      onClick={() => toggleCategory(category)}
                    >
                      <ion-icon name={expandedCategories.includes(category) ? 'chevron-down-outline' : 'chevron-forward-outline'}></ion-icon>
                      <span>{category}</span>
                    </button>
                    
                    {expandedCategories.includes(category) && (
                      <div className="settings-category-items">
                        {settingsItems
                          .filter(item => item.category === category)
                          .map(item => (
                            <button
                              key={item.id}
                              className="settings-item"
                              onClick={() => openModal(item.id)}
                            >
                              {item.label}
                            </button>
                          ))
                        }
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="settings-main">
                {selectedSetting === 'general' ? (
                  <GeneralSettingsForm />
                ) : selectedSetting && modalComponents[selectedSetting] ? (
                  <div className="settings-modal-content">
                    {React.createElement(modalComponents[selectedSetting], { 
                      onClose: () => setSelectedSetting(null) 
                    })}
                  </div>
                ) : (
                  <div className="settings-welcome">
                    <div className="settings-welcome-content">
                      <ion-icon name="settings-outline"></ion-icon>
                      <h2>Welcome to Settings</h2>
                      <p>Select a setting from the sidebar to configure your HRMS system.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <QuickAccess />
      </div>

      {/* Modal overlays are now rendered in the main content area */}
    </div>
  );
};

export default Settings;