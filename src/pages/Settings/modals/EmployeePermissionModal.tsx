import React, { useState, useEffect } from 'react';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
  avatar?: string;
}

interface Permission {
  key: string;
  label: string;
  icon: string;
  color: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface PermissionModule {
  name: string;
  permissions: Permission[];
  expanded: boolean;
}

interface EmployeePermissionModalProps {
  onClose: () => void;
}

const EmployeePermissionModal: React.FC<EmployeePermissionModalProps> = ({ onClose }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionModules, setPermissionModules] = useState<PermissionModule[]>([]);

  // Mock employee data
  const employees: Employee[] = [
    { id: '1', name: 'Dileesh sai', employeeId: 'PEP0002', department: 'None', role: 'None' },
    { id: '2', name: 'Prasanth Kathi', employeeId: 'PEP0006', department: 'None', role: 'None' },
    { id: '3', name: 'Prasanth Kathi', employeeId: 'PEP0008', department: 'None', role: 'None' },
    { id: '4', name: 'Prasanth Kathi', employeeId: 'PEP0010', department: 'None', role: 'None' },
    { id: '5', name: 'Tarun', employeeId: 'PEP0007', department: 'None', role: 'None' },
    { id: '6', name: 'Tarun', employeeId: 'PEP0003', department: 'None', role: 'None' },
    { id: '7', name: 'uday kundan', employeeId: 'PEP0009', department: 'None', role: 'None' },
  ];

  // Initialize permission modules
  useEffect(() => {
    const modules: PermissionModule[] = [
      {
        name: 'Base',
        expanded: true,
        permissions: [
          { key: 'company', label: 'Company', icon: 'CO', color: '#ff6b35', create: false, read: false, update: false, delete: false },
          { key: 'department', label: 'Department', icon: 'DE', color: '#6c757d', create: false, read: false, update: false, delete: false },
          { key: 'job_position', label: 'Job position', icon: 'JP', color: '#28a745', create: false, read: false, update: false, delete: false },
          { key: 'job_role', label: 'Job role', icon: 'JR', color: '#17a2b8', create: false, read: false, update: false, delete: false },
          { key: 'work_type', label: 'Work type', icon: 'WT', color: '#ffc107', create: false, read: false, update: false, delete: false },
          { key: 'rotating_work_type', label: 'Rotating work type', icon: 'RT', color: '#e91e63', create: false, read: false, update: false, delete: false },
          { key: 'rotating_work_type_assign', label: 'Rotating work type assign', icon: 'RA', color: '#9c27b0', create: false, read: false, update: false, delete: false },
          { key: 'employee_type', label: 'Employee type', icon: 'ET', color: '#007bff', create: false, read: false, update: false, delete: false },
          { key: 'employee_shift', label: 'Employee shift', icon: 'ES', color: '#fd7e14', create: false, read: false, update: false, delete: false },
          { key: 'employee_shift_schedule', label: 'Employee shift schedule', icon: 'SS', color: '#20c997', create: false, read: false, update: false, delete: false },
          { key: 'rotating_shift', label: 'Rotating shift', icon: 'RS', color: '#6f42c1', create: false, read: false, update: false, delete: false },
          { key: 'rotating_shift_assign', label: 'Rotating shift assign', icon: 'SA', color: '#dc3545', create: false, read: false, update: false, delete: false },
          { key: 'baserequest_file', label: 'Baserequest file', icon: 'BF', color: '#198754', create: false, read: false, update: false, delete: false },
          { key: 'work_type_request', label: 'Work type request', icon: 'WR', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
          { key: 'work_type_request_comment', label: 'Work type request comment', icon: 'WC', color: '#6610f2', create: false, read: false, update: false, delete: false },
          { key: 'shift_request', label: 'Shift request', icon: 'SR', color: '#d63384', create: false, read: false, update: false, delete: false },
          { key: 'shift_request_comment', label: 'Shift request comment', icon: 'SC', color: '#fd7e14', create: false, read: false, update: false, delete: false },
          { key: 'tag', label: 'Tag', icon: 'TG', color: '#20c997', create: false, read: false, update: false, delete: false },
          { key: 'horilla_mail_template', label: 'Horilla mail template', icon: 'MT', color: '#0d6efd', create: false, read: false, update: false, delete: false },
          { key: 'email_configuration', label: 'Email configuration', icon: 'EC', color: '#198754', create: false, read: false, update: false, delete: false },
          { key: 'multiple_approval_condition', label: 'Multiple approval condition', icon: 'AC', color: '#dc3545', create: false, read: false, update: false, delete: false },
          { key: 'dynamic_pagination', label: 'Dynamic Pagination', icon: 'DP', color: '#6f42c1', create: false, read: false, update: false, delete: false },
          { key: 'announcement_expire', label: 'Announcement expire', icon: 'AE', color: '#fd7e14', create: false, read: false, update: false, delete: false },
          { key: 'announcement', label: 'Announcement', icon: 'AN', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
          { key: 'announcement_comment', label: 'Announcement comment', icon: 'AC', color: '#6610f2', create: false, read: false, update: false, delete: false },
          { key: 'biometric_attendance', label: 'Biometric attendance', icon: 'BA', color: '#d63384', create: false, read: false, update: false, delete: false },
          { key: 'holiday', label: 'Holiday', icon: 'HD', color: '#20c997', create: false, read: false, update: false, delete: false },
          { key: 'company_leave', label: 'Company leave', icon: 'CL', color: '#198754', create: false, read: false, update: false, delete: false },
          { key: 'penalty_account', label: 'Penalty account', icon: 'PA', color: '#dc3545', create: false, read: false, update: false, delete: false },
          { key: 'notification_sound', label: 'Notification sound', icon: 'NS', color: '#0d6efd', create: false, read: false, update: false, delete: false }
        ]
       },
       {
         name: 'Employee',
         expanded: false,
         permissions: [
           { key: 'employee', label: 'Employee', icon: 'EM', color: '#007bff', create: false, read: false, update: false, delete: false },
           { key: 'employee_tag', label: 'Employee Tag', icon: 'ET', color: '#28a745', create: false, read: false, update: false, delete: false },
           { key: 'historical_employee_work_info', label: 'Historical Employee Work Information', icon: 'HW', color: '#6c757d', create: false, read: false, update: false, delete: false },
           { key: 'employee_work_info', label: 'Employee Work Information', icon: 'WI', color: '#17a2b8', create: false, read: false, update: false, delete: false },
           { key: 'employee_bank_details', label: 'Employee Bank Details', icon: 'BD', color: '#ffc107', create: false, read: false, update: false, delete: false },
           { key: 'note_files', label: 'Note Files', icon: 'NF', color: '#e91e63', create: false, read: false, update: false, delete: false },
           { key: 'employee_note', label: 'Employee Note', icon: 'EN', color: '#9c27b0', create: false, read: false, update: false, delete: false },
           { key: 'policy_multiple_file', label: 'Policy Multiple File', icon: 'PF', color: '#fd7e14', create: false, read: false, update: false, delete: false },
           { key: 'policy', label: 'Policy', icon: 'PO', color: '#20c997', create: false, read: false, update: false, delete: false },
           { key: 'bonus_point', label: 'Bonus Point', icon: 'BP', color: '#6f42c1', create: false, read: false, update: false, delete: false },
           { key: 'action_type', label: 'Action Type', icon: 'AT', color: '#dc3545', create: false, read: false, update: false, delete: false },
           { key: 'disciplinary_action', label: 'Disciplinary Action', icon: 'DA', color: '#198754', create: false, read: false, update: false, delete: false },
           { key: 'employee_general_settings', label: 'Employee general Settings', icon: 'GS', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
           { key: 'profile_edit_feature', label: 'Profile Edit Feature', icon: 'PE', color: '#6610f2', create: false, read: false, update: false, delete: false }
         ]
       },
       {
         name: 'SYNC documents',
         expanded: false,
         permissions: [
           { key: 'document_request', label: 'Document request', icon: 'DR', color: '#ff6b35', create: false, read: false, update: false, delete: false },
           { key: 'document', label: 'Document', icon: 'DO', color: '#6c757d', create: false, read: false, update: false, delete: false }
         ]
       },
       {
         name: 'SYNC automations',
         expanded: false,
         permissions: [
           { key: 'mail_automation', label: 'Mail automation', icon: 'MA', color: '#007bff', create: false, read: false, update: false, delete: false }
         ]
       },
       {
         name: 'Recruitment',
         expanded: false,
         permissions: [
           { key: 'survey_template', label: 'Survey template', icon: 'ST', color: '#28a745', create: false, read: false, update: false, delete: false },
           { key: 'recruitment', label: 'Recruitment', icon: 'RE', color: '#17a2b8', create: false, read: false, update: false, delete: false },
           { key: 'stage', label: 'Stage', icon: 'SG', color: '#ffc107', create: false, read: false, update: false, delete: false },
           { key: 'candidate', label: 'Candidate', icon: 'CA', color: '#e91e63', create: false, read: false, update: false, delete: false },
           { key: 'recruitment_survey', label: 'Recruitment survey', icon: 'RS', color: '#9c27b0', create: false, read: false, update: false, delete: false },
           { key: 'skill_zone', label: 'Skill zone', icon: 'SZ', color: '#fd7e14', create: false, read: false, update: false, delete: false },
           { key: 'skill_zone_candidate', label: 'Skill Zone candidate', icon: 'SC', color: '#20c997', create: false, read: false, update: false, delete: false },
           { key: 'candidate_rating', label: 'Candidate rating', icon: 'CR', color: '#6f42c1', create: false, read: false, update: false, delete: false },
           { key: 'schedule_interview', label: 'Schedule interview', icon: 'SI', color: '#dc3545', create: false, read: false, update: false, delete: false },
           { key: 'candidate_document_request', label: 'Candidate document request', icon: 'CD', color: '#198754', create: false, read: false, update: false, delete: false },
           { key: 'candidate_document', label: 'Candidate document', icon: 'CD', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
           { key: 'linkedin_account', label: 'Linked in account', icon: 'LI', color: '#6610f2', create: false, read: false, update: false, delete: false }
         ]
       },
       {
         name: 'Leave',
         expanded: false,
         permissions: [
           { key: 'leave_type', label: 'Leave Type', icon: 'LT', color: '#d63384', create: false, read: false, update: false, delete: false },
           { key: 'available_leave', label: 'Available Leave', icon: 'AL', color: '#fd7e14', create: false, read: false, update: false, delete: false },
           { key: 'leave_request', label: 'Leave Request', icon: 'LR', color: '#20c997', create: false, read: false, update: false, delete: false },
           { key: 'leaverequest_file', label: 'Leaverequest File', icon: 'LF', color: '#0d6efd', create: false, read: false, update: false, delete: false },
           { key: 'leaverequest_comment', label: 'LeaveRequest Comment', icon: 'LC', color: '#198754', create: false, read: false, update: false, delete: false },
           { key: 'leave_allocation_request', label: 'Leave Allocation Request', icon: 'LA', color: '#dc3545', create: false, read: false, update: false, delete: false },
           { key: 'leave_allocation_comment', label: 'Leave Allocation Request comment', icon: 'AC', color: '#6f42c1', create: false, read: false, update: false, delete: false },
           { key: 'restrict_leave', label: 'Restrict Leave', icon: 'RL', color: '#fd7e14', create: false, read: false, update: false, delete: false },
           { key: 'compensatory_leave_request', label: 'Compensatory Leave Request', icon: 'CL', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
           { key: 'leave_general_settings', label: 'Leave General Settings', icon: 'LG', color: '#6610f2', create: false, read: false, update: false, delete: false },
           { key: 'compensatory_comment', label: 'Compensatory LeaveRequest Comment', icon: 'CC', color: '#d63384', create: false, read: false, update: false, delete: false }
         ]
       },
        {
          name: 'Pms',
          expanded: false,
          permissions: [
            { key: 'period', label: 'Period', icon: 'PE', color: '#ff6b35', create: false, read: false, update: false, delete: false },
            { key: 'historical_key_result', label: 'Historical key result', icon: 'HK', color: '#6c757d', create: false, read: false, update: false, delete: false },
            { key: 'key_result', label: 'Key result', icon: 'KR', color: '#28a745', create: false, read: false, update: false, delete: false },
            { key: 'historical_objective', label: 'Historical objective', icon: 'HO', color: '#17a2b8', create: false, read: false, update: false, delete: false },
            { key: 'objective', label: 'Objective', icon: 'OB', color: '#ffc107', create: false, read: false, update: false, delete: false },
            { key: 'historical_employee_objective', label: 'Historical employee objective', icon: 'HE', color: '#e91e63', create: false, read: false, update: false, delete: false },
            { key: 'employee_objective', label: 'Employee objective', icon: 'EO', color: '#9c27b0', create: false, read: false, update: false, delete: false },
            { key: 'historical_comment', label: 'Historical comment', icon: 'HC', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'comment', label: 'Comment', icon: 'CO', color: '#20c997', create: false, read: false, update: false, delete: false },
            { key: 'historical_employee_key_result', label: 'Historical employee key result', icon: 'HK', color: '#6f42c1', create: false, read: false, update: false, delete: false },
            { key: 'employee_key_result', label: 'Employee key result', icon: 'EK', color: '#dc3545', create: false, read: false, update: false, delete: false },
            { key: 'question_template', label: 'Question template', icon: 'QT', color: '#198754', create: false, read: false, update: false, delete: false },
            { key: 'question', label: 'Question', icon: 'QU', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
            { key: 'question_options', label: 'Question options', icon: 'QO', color: '#6610f2', create: false, read: false, update: false, delete: false },
            { key: 'feedback', label: 'Feedback', icon: 'FB', color: '#d63384', create: false, read: false, update: false, delete: false },
            { key: 'anonymous_feedback', label: 'Anonymous feedback', icon: 'AF', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'answer', label: 'Answer', icon: 'AN', color: '#20c997', create: false, read: false, update: false, delete: false },
            { key: 'key_result_feedback', label: 'Key result feedback', icon: 'KF', color: '#0d6efd', create: false, read: false, update: false, delete: false },
            { key: 'meetings', label: 'Meetings', icon: 'ME', color: '#198754', create: false, read: false, update: false, delete: false },
            { key: 'meetings_answer', label: 'Meetings answer', icon: 'MA', color: '#dc3545', create: false, read: false, update: false, delete: false },
            { key: 'employee_bonus_point', label: 'Employee bonus point', icon: 'EB', color: '#6f42c1', create: false, read: false, update: false, delete: false },
            { key: 'bonus_point_setting', label: 'Bonus point setting', icon: 'BS', color: '#fd7e14', create: false, read: false, update: false, delete: false }
          ]
        },
        {
          name: 'Onboarding',
          expanded: false,
          permissions: [
            { key: 'onboarding_stage', label: 'Onboarding Stage', icon: 'OS', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
            { key: 'onboarding_task', label: 'Onboarding Task', icon: 'OT', color: '#6610f2', create: false, read: false, update: false, delete: false },
            { key: 'onboarding_candidate', label: 'Onboarding Candidate', icon: 'OC', color: '#d63384', create: false, read: false, update: false, delete: false },
            { key: 'candidate_onboarding_stage', label: 'Candidate Onboarding Stage', icon: 'CS', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'historical_onboarding_task', label: 'Historical Onboarding Task', icon: 'HT', color: '#20c997', create: false, read: false, update: false, delete: false },
            { key: 'onboarding_task_current', label: 'Onboarding Task', icon: 'TC', color: '#0d6efd', create: false, read: false, update: false, delete: false },
            { key: 'onboarding_portal', label: 'Onboarding Portal', icon: 'OP', color: '#198754', create: false, read: false, update: false, delete: false }
          ]
        },
        {
          name: 'Asset',
          expanded: false,
          permissions: [
            { key: 'asset_category', label: 'Asset Category', icon: 'AC', color: '#dc3545', create: false, read: false, update: false, delete: false },
            { key: 'asset_batch', label: 'Asset Batch', icon: 'AB', color: '#6f42c1', create: false, read: false, update: false, delete: false },
            { key: 'asset', label: 'Asset', icon: 'AS', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'asset_allocation', label: 'Asset Allocation', icon: 'AA', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
            { key: 'asset_request', label: 'Asset Request', icon: 'AR', color: '#6610f2', create: false, read: false, update: false, delete: false }
          ]
        },
        {
          name: 'Attendance',
          expanded: false,
          permissions: [
            { key: 'attendance_activity', label: 'Attendance Activity', icon: 'AA', color: '#d63384', create: false, read: false, update: false, delete: false },
            { key: 'batch_attendance', label: 'Batch Attendance', icon: 'BA', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'historical_attendance', label: 'Historical Attendance', icon: 'HA', color: '#20c997', create: false, read: false, update: false, delete: false },
            { key: 'attendance', label: 'Attendance', icon: 'AT', color: '#0d6efd', create: false, read: false, update: false, delete: false },
            { key: 'attendance_request_file', label: 'Attendance Request File', icon: 'AF', color: '#198754', create: false, read: false, update: false, delete: false },
            { key: 'attendance_request_comment', label: 'Attendance Request Comment', icon: 'AC', color: '#dc3545', create: false, read: false, update: false, delete: false },
            { key: 'hour_account', label: 'Hour Account', icon: 'HA', color: '#6f42c1', create: false, read: false, update: false, delete: false },
            { key: 'attendance_late_come_early_out', label: 'Attendance Late come early out', icon: 'AL', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'attendance_validation_condition', label: 'Attendance Validation Condition', icon: 'AV', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
            { key: 'grace_time', label: 'Grace Time', icon: 'GT', color: '#6610f2', create: false, read: false, update: false, delete: false },
            { key: 'attendance_general_setting', label: 'Attendance General Setting', icon: 'AG', color: '#d63384', create: false, read: false, update: false, delete: false },
            { key: 'work_record', label: 'Work Record', icon: 'WR', color: '#fd7e14', create: false, read: false, update: false, delete: false }
          ]
        },
        {
          name: 'Payroll',
          expanded: false,
          permissions: [
            { key: 'filling_status', label: 'Filling status', icon: 'FS', color: '#20c997', create: false, read: false, update: false, delete: false },
            { key: 'contract', label: 'Contract', icon: 'CT', color: '#0d6efd', create: false, read: false, update: false, delete: false },
            { key: 'allowance', label: 'Allowance', icon: 'AL', color: '#198754', create: false, read: false, update: false, delete: false },
            { key: 'deduction', label: 'Deduction', icon: 'DE', color: '#dc3545', create: false, read: false, update: false, delete: false },
            { key: 'payslip', label: 'Payslip', icon: 'PS', color: '#6f42c1', create: false, read: false, update: false, delete: false },
            { key: 'loan_account', label: 'Loan account', icon: 'LA', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'reimbursement', label: 'Reimbursement', icon: 'RE', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
            { key: 'reimbursement_file', label: 'Reimbursement file', icon: 'RF', color: '#6610f2', create: false, read: false, update: false, delete: false },
            { key: 'reimbursement_comment', label: 'Reimbursementrequest comment', icon: 'RC', color: '#d63384', create: false, read: false, update: false, delete: false },
            { key: 'payroll_general_setting', label: 'Payroll general setting', icon: 'PG', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'encashment_general_settings', label: 'Encashment general settings', icon: 'EG', color: '#20c997', create: false, read: false, update: false, delete: false },
            { key: 'payslip_auto_generate', label: 'Payslip auto generate', icon: 'PA', color: '#0d6efd', create: false, read: false, update: false, delete: false },
            { key: 'payroll_settings', label: 'Payroll settings', icon: 'PS', color: '#198754', create: false, read: false, update: false, delete: false },
            { key: 'tax_bracket', label: 'Tax bracket', icon: 'TB', color: '#dc3545', create: false, read: false, update: false, delete: false }
          ]
        },
        {
          name: 'Biometric',
          expanded: false,
          permissions: [
            { key: 'biometric_device', label: 'Biometric device', icon: 'BD', color: '#6f42c1', create: false, read: false, update: false, delete: false },
            { key: 'employee_in_biometric_device', label: 'Employee in Biometric Device', icon: 'EB', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'cosec_attendance_arguments', label: 'Cosec attendance arguments', icon: 'CA', color: '#0dcaf0', create: false, read: false, update: false, delete: false }
          ]
        },
        {
          name: 'Helpdesk',
          expanded: false,
          permissions: [
            { key: 'department_manager', label: 'Department Manager', icon: 'DM', color: '#6610f2', create: false, read: false, update: false, delete: false },
            { key: 'ticket_type', label: 'Ticket Type', icon: 'TT', color: '#d63384', create: false, read: false, update: false, delete: false },
            { key: 'ticket', label: 'Ticket', icon: 'TI', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'claim_request', label: 'Claim Request', icon: 'CR', color: '#20c997', create: false, read: false, update: false, delete: false },
            { key: 'comment', label: 'Comment', icon: 'CO', color: '#0d6efd', create: false, read: false, update: false, delete: false },
            { key: 'faq_category', label: 'Faq Category', icon: 'FC', color: '#198754', create: false, read: false, update: false, delete: false },
            { key: 'faq', label: 'Faq', icon: 'FA', color: '#dc3545', create: false, read: false, update: false, delete: false }
          ]
        },
        {
          name: 'Offboarding',
          expanded: false,
          permissions: [
            { key: 'offboarding', label: 'Offboarding', icon: 'OF', color: '#6f42c1', create: false, read: false, update: false, delete: false },
            { key: 'offboarding_stage', label: 'Offboarding stage', icon: 'OS', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'offboarding_stage_multiple_file', label: 'Offboarding stage multiple file', icon: 'OM', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
            { key: 'offboarding_employee', label: 'Offboarding employee', icon: 'OE', color: '#6610f2', create: false, read: false, update: false, delete: false },
            { key: 'resignation_letter', label: 'Resignation letter', icon: 'RL', color: '#d63384', create: false, read: false, update: false, delete: false },
            { key: 'offboarding_task', label: 'Offboarding task', icon: 'OT', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'historical_employee_task', label: 'Historical employee task', icon: 'HE', color: '#20c997', create: false, read: false, update: false, delete: false },
            { key: 'employee_task', label: 'Employee task', icon: 'ET', color: '#0d6efd', create: false, read: false, update: false, delete: false },
            { key: 'exit_reason', label: 'Exit reason', icon: 'ER', color: '#198754', create: false, read: false, update: false, delete: false },
            { key: 'offboarding_note', label: 'Offboarding note', icon: 'ON', color: '#dc3545', create: false, read: false, update: false, delete: false },
            { key: 'offboarding_general_setting', label: 'Offboarding general setting', icon: 'OG', color: '#6f42c1', create: false, read: false, update: false, delete: false }
          ]
        },
        {
          name: 'Project',
          expanded: false,
          permissions: [
            { key: 'project', label: 'Project', icon: 'PR', color: '#fd7e14', create: false, read: false, update: false, delete: false },
            { key: 'project_stage', label: 'Project Stage', icon: 'PS', color: '#0dcaf0', create: false, read: false, update: false, delete: false },
            { key: 'task', label: 'Task', icon: 'TA', color: '#6610f2', create: false, read: false, update: false, delete: false },
            { key: 'time_sheet', label: 'Time Sheet', icon: 'TS', color: '#d63384', create: false, read: false, update: false, delete: false }
          ]
        }
      ];
      setPermissionModules(modules);
    }, []);

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId);

  const toggleModuleExpansion = (moduleName: string) => {
    setPermissionModules(prev => 
      prev.map(module => 
        module.name === moduleName 
          ? { ...module, expanded: !module.expanded }
          : module
      )
    );
  };

  const togglePermission = (moduleIndex: number, permissionIndex: number, field: 'create' | 'read' | 'update' | 'delete') => {
    setPermissionModules(prev => {
      const newModules = [...prev];
      newModules[moduleIndex].permissions[permissionIndex][field] = !newModules[moduleIndex].permissions[permissionIndex][field];
      return newModules;
    });
  };

  const toggleRowPermission = (moduleIndex: number, permissionIndex: number, enabled: boolean) => {
    setPermissionModules(prev => {
      const newModules = [...prev];
      const permission = newModules[moduleIndex].permissions[permissionIndex];
      permission.create = enabled;
      permission.read = enabled;
      permission.update = enabled;
      permission.delete = enabled;
      return newModules;
    });
  };

  const isRowEnabled = (permission: Permission) => {
    return permission.create || permission.read || permission.update || permission.delete;
  };

  const handleSave = () => {
    if (!selectedEmployeeId) {
      alert('Please select an employee first.');
      return;
    }
    
    const enabledPermissions = permissionModules.flatMap(module => 
      module.permissions.filter(permission => 
        permission.create || permission.read || permission.update || permission.delete
      ).map(permission => ({
        module: module.name,
        permission: permission.label,
        actions: {
          create: permission.create,
          read: permission.read,
          update: permission.update,
          delete: permission.delete
        }
      }))
    );
    
    console.log('Assigning permissions for employee:', selectedEmployee?.name, enabledPermissions);
    alert(`Permissions successfully assigned to ${selectedEmployee?.name}!`);
    onClose();
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
      <input 
        type="checkbox" 
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0 }} 
      />
      <span style={{
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: checked ? '#ff6b35' : '#ccc',
        borderRadius: '20px',
        transition: '0.4s'
      }}></span>
      <span style={{
        position: 'absolute',
        content: '',
        height: '16px',
        width: '16px',
        left: checked ? '22px' : '2px',
        bottom: '2px',
        backgroundColor: 'white',
        borderRadius: '50%',
        transition: '0.4s'
      }}></span>
    </label>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1200px', maxHeight: '90vh' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 0 20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Employee Permissions</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 40px 8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  width: '250px',
                  outline: 'none'
                }}
              />
              <ion-icon name="search-outline" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: '16px'
              }}></ion-icon>
            </div>
            <button 
              type="button" 
              onClick={handleSave}
              disabled={!selectedEmployeeId}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: selectedEmployeeId ? '#ff6b35' : '#ccc',
                color: 'white',
                cursor: selectedEmployeeId ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ion-icon name="add-outline"></ion-icon>
              Assign
            </button>
            <button className="modal-close" onClick={onClose} style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '4px'
            }}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
        </div>
        
        <div className="modal-body" style={{ padding: '20px', height: 'calc(90vh - 120px)', overflow: 'auto' }}>
          {/* Employees Dropdown */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '16px' }}>Employees</label>
            <div style={{ position: 'relative' }}>
              <select 
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  appearance: 'none',
                  outline: 'none'
                }}
              >
                <option value="">Select an employee...</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.employeeId})
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#666'
              }}>
                <ion-icon name="chevron-down-outline"></ion-icon>
              </div>
            </div>
          </div>

          {selectedEmployeeId && (
            <>
              {/* Permission Modules */}
              {permissionModules
                .filter(module => 
                  searchTerm === '' || 
                  module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  module.permissions.some(p => p.label.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((module, moduleIndex) => (
                <div key={module.name} style={{ marginBottom: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* Module Header */}
                  <div 
                    onClick={() => toggleModuleExpansion(module.name)}
                    style={{
                      backgroundColor: '#f9fafb',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: module.expanded ? '1px solid #e5e7eb' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px', color: '#374151' }}>{module.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {module.permissions.filter(p => 
                          searchTerm === '' || p.label.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length}
                      </span>
                      <ion-icon 
                        name={module.expanded ? 'chevron-down-outline' : 'chevron-forward-outline'}
                        style={{ fontSize: '16px', color: '#6b7280' }}
                      ></ion-icon>
                    </div>
                  </div>

                  {/* Module Permissions */}
                  {module.expanded && (
                    <div style={{ backgroundColor: 'white' }}>
                      {/* Table Header */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr 80px 80px 80px 80px',
                        backgroundColor: '#f3f4f6',
                        padding: '12px',
                        borderBottom: '1px solid #e0e0e0',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        <div></div>
                        <div>Actions</div>
                        <div style={{ textAlign: 'center' }}><ion-icon name="add-circle-outline"></ion-icon></div>
                        <div style={{ textAlign: 'center' }}><ion-icon name="eye-outline"></ion-icon></div>
                        <div style={{ textAlign: 'center' }}><ion-icon name="create-outline"></ion-icon></div>
                        <div style={{ textAlign: 'center' }}><ion-icon name="trash-outline"></ion-icon></div>
                      </div>

                      {/* Permission Rows */}
                      {module.permissions
                        .filter(permission => 
                          searchTerm === '' || permission.label.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((permission, permissionIndex) => {
                          const actualIndex = module.permissions.findIndex(p => p.key === permission.key);
                          return (
                            <div key={permission.key} style={{
                              display: 'grid',
                              gridTemplateColumns: '40px 1fr 80px 80px 80px 80px',
                              padding: '12px',
                              borderBottom: permissionIndex < module.permissions.filter(p => 
                                searchTerm === '' || p.label.toLowerCase().includes(searchTerm.toLowerCase())
                              ).length - 1 ? '1px solid #e0e0e0' : 'none',
                              alignItems: 'center'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                  type="checkbox" 
                                  checked={isRowEnabled(permission)}
                                  onChange={(e) => toggleRowPermission(moduleIndex, actualIndex, e.target.checked)}
                                  style={{ marginRight: '8px', cursor: 'pointer' }} 
                                />
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  backgroundColor: permission.color,
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10px',
                                  fontWeight: 'bold'
                                }}>
                                  {permission.icon}
                                </div>
                                <span style={{ fontSize: '14px' }}>{permission.label}</span>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <ToggleSwitch 
                                  checked={permission.create}
                                  onChange={() => togglePermission(moduleIndex, actualIndex, 'create')}
                                />
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <ToggleSwitch 
                                  checked={permission.read}
                                  onChange={() => togglePermission(moduleIndex, actualIndex, 'read')}
                                />
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <ToggleSwitch 
                                  checked={permission.update}
                                  onChange={() => togglePermission(moduleIndex, actualIndex, 'update')}
                                />
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <ToggleSwitch 
                                  checked={permission.delete}
                                  onChange={() => togglePermission(moduleIndex, actualIndex, 'delete')}
                                />
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {!selectedEmployeeId && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              fontSize: '16px'
            }}>
              Please select an employee to manage permissions
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default EmployeePermissionModal;