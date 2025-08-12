import React, { useState } from 'react';
import './Settings.css';

// Import all modal components
import GeneralSettingsModal from './modals/GeneralSettingsModal';
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
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Modal mapping for all settings items
  const modalComponents: { [key: string]: React.ComponentType<{ onClose: () => void }> } = {
    'General Settings': GeneralSettingsModal,
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Base']);

  const settingsItems: SettingsItem[] = [
    // Base
    { id: 'general', label: 'General Settings', category: 'Base' },
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
    
    // Leaves
    { id: 'restrictions', label: 'Restrictions', category: 'Leaves' },
    { id: 'compensatory-leave', label: 'Compensatory Leave', category: 'Leaves' },
    
    // Payroll
    { id: 'payslip-auto-generation', label: 'Payslip Auto Generation', category: 'Payroll' },
    
    // Performance
    { id: 'bonus-point-setting', label: 'Bonus Point Setting', category: 'Performance' },
    
    // Help Desk
    { id: 'department-managers', label: 'Department Managers', category: 'Help Desk' },
    { id: 'ticket-type', label: 'Ticket Type', category: 'Help Desk' },
    { id: 'helpdesk-tags', label: 'Helpdesk Tags', category: 'Help Desk' },
  ];

  const categories = ['Base', 'Recruitment', 'Employee', 'Attendance', 'Leaves', 'Payroll', 'Performance', 'Help Desk'];

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
      setActiveModal(item.label);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };



  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Configure your HRMS system settings</p>
      </div>

      <div className="settings-content">
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
          {!activeModal ? (
            <div className="settings-welcome">
              <div className="settings-welcome-content">
                <ion-icon name="settings-outline"></ion-icon>
                <h2>Welcome to Settings</h2>
                <p>Select a setting from the sidebar to configure your HRMS system.</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Render active modal */}
      {activeModal && modalComponents[activeModal] && 
        React.createElement(modalComponents[activeModal], { 
          onClose: () => setActiveModal(null) 
        })
      }
    </div>
  );
};

export default Settings;