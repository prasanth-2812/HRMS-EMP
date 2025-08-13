import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type ModalType = 
  // Base
  | 'department'
  | 'job_positions'
  | 'job_role'
  | 'company'
  // Recruitment
  | 'candidate_self_tracking'
  | 'candidate_reject_reason'
  | 'skills'
  | 'linkedin_integration'
  // Employee
  | 'work_type'
  | 'rotating_work_type'
  | 'employee_shift'
  | 'rotating_shift'
  | 'employee_shift_schedule'
  | 'employee_type'
  | 'disciplinary_action_type'
  | 'employee_tags'
  // Attendance
  | 'track_late_come_early_out'
  | 'attendance_break_point'
  | 'check_in_check_out'
  | 'grace_time'
  | 'biometric_attendance'
  | 'ip_restriction'
  | 'geo_face_config'
  // Leaves
  | 'restrictions'
  | 'compensatory_leave'
  // Payroll
  | 'payslip_auto_generation'
  // Performance
  | 'bonus_point_setting'
  // Help Desk
  | 'department_managers'
  | 'ticket_type'
  | 'helpdesk_tags'
  // General Settings
  | 'general_settings'
  | 'employee_permission'
  | 'accessibility_restriction'
  | 'user_group'
  | 'date_time_format'
  | 'history_tags'
  | 'mail_server'
  | 'gdrive_backup'
  // Settings
  | 'announcement_expire'
  | 'default_records_per_page'
  | 'employee_account_restrictions'
  | 'registration_request'
  | 'time_runner'
  | 'notice_period'
  | 'badge_prefix'
  | 'encashment_redeem_condition'
  | 'employee_history_tracking'
  | 'currency';

interface ModalState {
  id: ModalType | null;
  props?: any;
  isOpen: boolean;
}

interface ModalContextType {
  modalState: ModalState;
  openModal: (id: ModalType, props?: any) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState>({
    id: null,
    props: {},
    isOpen: false
  });

  const openModal = (id: ModalType, props?: any) => {
    console.log('ModalContext openModal called with:', id, props);
    setModalState({
      id,
      props: props || {},
      isOpen: true
    });
    console.log('Modal state updated to:', { id, props: props || {}, isOpen: true });
    // Lock body scroll
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalState({
      id: null,
      props: {},
      isOpen: false
    });
    // Unlock body scroll
    document.body.style.overflow = 'unset';
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modalState.isOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [modalState.isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    console.error('useModal must be used within a ModalProvider');
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};