import React, { useState, useMemo } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Navbar from '../../../components/Layout/Navbar';
import { useSidebar } from '../../../contexts/SidebarContext';
import './DisciplinaryActions.css';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  department: string;
  position: string;
}

interface DisciplinaryAction {
  id: string;
  employee: Employee;
  actionType: 'verbal_warning' | 'written_warning' | 'suspension' | 'termination' | 'performance_improvement';
  reason: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  actionDate: string;
  effectiveDate: string;
  expiryDate?: string;
  issuedBy: string;
  witnessedBy?: string;
  status: 'pending' | 'active' | 'completed' | 'appealed' | 'withdrawn';
  appealDate?: string;
  appealReason?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  documents: string[];
}

const DisciplinaryActions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    employee: '',
    actionType: '',
    reason: '',
    description: '',
    severity: '',
    actionDate: '',
    effectiveDate: '',
    expiryDate: '',
    witnessedBy: '',
    followUpRequired: false,
    followUpDate: ''
  });
  const { isCollapsed } = useSidebar();

  // Mock data for disciplinary actions
  const mockActions: DisciplinaryAction[] = [
    {
      id: 'DA-001',
      employee: {
        id: 'EMP-001',
        name: 'John Smith',
        avatar: '/avatars/john-smith.jpg',
        badgeId: 'HOH-001',
        department: 'Sales',
        position: 'Sales Executive'
      },
      actionType: 'written_warning',
      reason: 'Tardiness',
      description: 'Employee has been consistently late for work over the past month without valid reasons. This is the second occurrence after a verbal warning.',
      severity: 'moderate',
      actionDate: '2024-01-15',
      effectiveDate: '2024-01-15',
      expiryDate: '2024-07-15',
      issuedBy: 'Manager Name',
      witnessedBy: 'HR Representative',
      status: 'active',
      followUpRequired: true,
      followUpDate: '2024-02-15',
      documents: ['warning_letter.pdf', 'attendance_record.pdf']
    },
    {
      id: 'DA-002',
      employee: {
        id: 'EMP-002',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah-johnson.jpg',
        badgeId: 'HOH-002',
        department: 'Engineering',
        position: 'Software Developer'
      },
      actionType: 'performance_improvement',
      reason: 'Performance Issues',
      description: 'Employee performance has been below expectations for the last quarter. A performance improvement plan has been initiated.',
      severity: 'moderate',
      actionDate: '2024-01-10',
      effectiveDate: '2024-01-15',
      expiryDate: '2024-04-15',
      issuedBy: 'Team Lead',
      status: 'active',
      followUpRequired: true,
      followUpDate: '2024-02-01',
      documents: ['pip_document.pdf', 'performance_review.pdf']
    },
    {
      id: 'DA-003',
      employee: {
        id: 'EMP-003',
        name: 'Mike Chen',
        avatar: '/avatars/mike-chen.jpg',
        badgeId: 'HOH-003',
        department: 'Finance',
        position: 'Financial Analyst'
      },
      actionType: 'suspension',
      reason: 'Policy Violation',
      description: 'Employee violated company confidentiality policy by sharing sensitive financial information with external parties.',
      severity: 'severe',
      actionDate: '2024-01-08',
      effectiveDate: '2024-01-10',
      expiryDate: '2024-01-17',
      issuedBy: 'Department Head',
      witnessedBy: 'HR Director',
      status: 'completed',
      followUpRequired: false,
      documents: ['suspension_letter.pdf', 'investigation_report.pdf']
    },
    {
      id: 'DA-004',
      employee: {
        id: 'EMP-004',
        name: 'Emily Davis',
        avatar: '/avatars/emily-davis.jpg',
        badgeId: 'HOH-004',
        department: 'Marketing',
        position: 'Marketing Coordinator'
      },
      actionType: 'verbal_warning',
      reason: 'Inappropriate Behavior',
      description: 'Employee engaged in unprofessional conduct during a team meeting.',
      severity: 'minor',
      actionDate: '2024-01-12',
      effectiveDate: '2024-01-12',
      expiryDate: '2024-04-12',
      issuedBy: 'HR Manager',
      status: 'appealed',
      appealDate: '2024-01-14',
      appealReason: 'Employee disputes the characterization of the incident',
      followUpRequired: true,
      followUpDate: '2024-01-25',
      documents: ['verbal_warning_record.pdf']
    }
  ];

  // Filter and search logic
  const filteredActions = useMemo(() => {
    return mockActions.filter(action => {
      const matchesSearch = action.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          action.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          action.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          action.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || action.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || action.severity === severityFilter;
      const matchesActionType = actionTypeFilter === 'all' || action.actionType === actionTypeFilter;
      const matchesDepartment = departmentFilter === 'all' || action.employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesSeverity && matchesActionType && matchesDepartment;
    });
  }, [mockActions, searchTerm, statusFilter, severityFilter, actionTypeFilter, departmentFilter]);

  // Form handling functions
  const handleFormChange = (field: string, value: string | boolean) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateAction = async () => {
    if (!createForm.employee || !createForm.actionType || !createForm.reason || !createForm.actionDate) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setCreateForm({
        employee: '',
        actionType: '',
        reason: '',
        description: '',
        severity: '',
        actionDate: '',
        effectiveDate: '',
        expiryDate: '',
        witnessedBy: '',
        followUpRequired: false,
        followUpDate: ''
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating disciplinary action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = mockActions.length;
    const active = mockActions.filter(a => a.status === 'active').length;
    const pending = mockActions.filter(a => a.status === 'pending').length;
    const appealed = mockActions.filter(a => a.status === 'appealed').length;
    const followUpRequired = mockActions.filter(a => a.followUpRequired && a.status === 'active').length;
    
    return { total, active, pending, appealed, followUpRequired };
  }, [mockActions]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'oh-status-badge oh-status-badge--pending',
      active: 'oh-status-badge oh-status-badge--active',
      completed: 'oh-status-badge oh-status-badge--completed',
      appealed: 'oh-status-badge oh-status-badge--appealed',
      withdrawn: 'oh-status-badge oh-status-badge--withdrawn'
    };
    
    return (
      <span className={statusClasses[status as keyof typeof statusClasses]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const severityClasses = {
      minor: 'oh-severity-badge oh-severity-badge--minor',
      moderate: 'oh-severity-badge oh-severity-badge--moderate',
      severe: 'oh-severity-badge oh-severity-badge--severe',
      critical: 'oh-severity-badge oh-severity-badge--critical'
    };
    
    return (
      <span className={severityClasses[severity as keyof typeof severityClasses]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const getActionTypeBadge = (actionType: string) => {
    const actionTypeLabels = {
      verbal_warning: 'Verbal Warning',
      written_warning: 'Written Warning',
      suspension: 'Suspension',
      termination: 'Termination',
      performance_improvement: 'Performance Improvement Plan'
    };
    
    const actionTypeClasses = {
      verbal_warning: 'oh-action-type-badge oh-action-type-badge--verbal',
      written_warning: 'oh-action-type-badge oh-action-type-badge--written',
      suspension: 'oh-action-type-badge oh-action-type-badge--suspension',
      termination: 'oh-action-type-badge oh-action-type-badge--termination',
      performance_improvement: 'oh-action-type-badge oh-action-type-badge--pip'
    };
    
    return (
      <span className={actionTypeClasses[actionType as keyof typeof actionTypeClasses]}>
        {actionTypeLabels[actionType as keyof typeof actionTypeLabels]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="da-dashboard">
      <Sidebar />
      <div className={`da-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar pageTitle="Disciplinary Actions" />
        <div className="da-content">
          <div className="oh-container">
            {/* Header Section */}
            <div className="oh-page-header">
              <div className="oh-page-header__content">
                <h1 className="oh-page-title">Disciplinary Actions</h1>
                <p className="oh-page-subtitle">Manage and track employee disciplinary actions</p>
              </div>
              <div className="oh-page-header__actions">
                <button 
                  className="oh-btn oh-btn--primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Take An Action
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="oh-stats-grid">
              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--total">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.total}</div>
                  <div className="oh-stat-card__label">Total Actions</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--active">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.active}</div>
                  <div className="oh-stat-card__label">Active</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--pending">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="10" y1="15" x2="10" y2="9"></line>
                    <line x1="14" y1="15" x2="14" y2="9"></line>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.pending}</div>
                  <div className="oh-stat-card__label">Pending</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--appealed">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M8 16H3v5"></path>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.appealed}</div>
                  <div className="oh-stat-card__label">Appealed</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--followup">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 6v6l4 2"></path>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.followUpRequired}</div>
                  <div className="oh-stat-card__label">Follow-up Required</div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="oh-controls">
              <div className="oh-controls__left">
                <div className="oh-search-field">
                  <svg className="oh-search-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="oh-search-field__input"
                    placeholder="Search disciplinary actions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="oh-controls__right">
                <select 
                  className="oh-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="appealed">Appealed</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>

                <select 
                  className="oh-select"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="all">All Severity</option>
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                  <option value="critical">Critical</option>
                </select>

                <select 
                  className="oh-select"
                  value={actionTypeFilter}
                  onChange={(e) => setActionTypeFilter(e.target.value)}
                >
                  <option value="all">All Action Types</option>
                  <option value="verbal_warning">Verbal Warning</option>
                  <option value="written_warning">Written Warning</option>
                  <option value="suspension">Suspension</option>
                  <option value="termination">Termination</option>
                  <option value="performance_improvement">Performance Improvement Plan</option>
                </select>

                <select 
                  className="oh-select"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            {/* Content Area */}
            <div className="oh-content-area">
              <div className="oh-table-container">
                <table className="oh-table">
                  <thead>
                    <tr>
                      <th>Action ID</th>
                      <th>Employee</th>
                      <th>Action Type</th>
                      <th>Reason</th>
                      <th>Severity</th>
                      <th>Action Date</th>
                      <th>Status</th>
                      <th>Follow-up</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActions.map((action) => (
                      <tr key={action.id}>
                        <td>
                          <span className="oh-action-id">{action.id}</span>
                        </td>
                        <td>
                          <div className="oh-employee-info">
                            <div className="oh-employee-avatar">
                              {action.employee.name.charAt(0)}
                            </div>
                            <div className="oh-employee-details">
                              <div className="oh-employee-name">{action.employee.name}</div>
                              <div className="oh-employee-badge">{action.employee.badgeId}</div>
                              <div className="oh-employee-dept">{action.employee.department}</div>
                            </div>
                          </div>
                        </td>
                        <td>{getActionTypeBadge(action.actionType)}</td>
                        <td>
                          <div className="oh-reason-info">
                            <div className="oh-reason-title">{action.reason}</div>
                            <div className="oh-reason-desc">{action.description.substring(0, 80)}...</div>
                          </div>
                        </td>
                        <td>{getSeverityBadge(action.severity)}</td>
                        <td>{formatDate(action.actionDate)}</td>
                        <td>{getStatusBadge(action.status)}</td>
                        <td>
                          {action.followUpRequired ? (
                            <div className="oh-followup-info">
                              <span className="oh-followup-required">Required</span>
                              {action.followUpDate && (
                                <div className="oh-followup-date">{formatDate(action.followUpDate)}</div>
                              )}
                            </div>
                          ) : (
                            <span className="oh-followup-not-required">Not Required</span>
                          )}
                        </td>
                        <td>
                          <div className="oh-actions">
                            <button className="oh-btn oh-btn--sm oh-btn--ghost">View</button>
                            {action.status === 'active' && action.followUpRequired && (
                              <button className="oh-btn oh-btn--sm oh-btn--secondary">Follow Up</button>
                            )}
                            {action.status === 'appealed' && (
                              <button className="oh-btn oh-btn--sm oh-btn--warning">Review Appeal</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredActions.length === 0 && (
                <div className="oh-empty-state">
                  <div className="oh-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <h3 className="oh-empty-state__title">No disciplinary actions found</h3>
                  <p className="oh-empty-state__message">
                    There are currently no disciplinary actions to consider.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Disciplinary Action Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay">
          <div className="oh-create-rotating-modal">
            <div className="oh-modal-header">
              <h2 className="oh-modal-title">Take Disciplinary Action</h2>
              <button 
                className="oh-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="oh-modal-body">
              <div className="oh-form-grid">
                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Employee <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.employee}
                    onChange={(e) => handleFormChange('employee', e.target.value)}
                  >
                    <option value="">Select employee</option>
                    {mockActions.map(action => (
                      <option key={action.employee.id} value={action.employee.id}>
                        {action.employee.name} - {action.employee.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Action Type <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.actionType}
                    onChange={(e) => handleFormChange('actionType', e.target.value)}
                  >
                    <option value="">Select action type</option>
                    <option value="verbal_warning">Verbal Warning</option>
                    <option value="written_warning">Written Warning</option>
                    <option value="suspension">Suspension</option>
                    <option value="performance_improvement">Performance Improvement</option>
                    <option value="termination">Termination</option>
                  </select>
                </div>
                
                <div className="oh-form-group">
                  <label className="oh-form-label">Severity <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.severity}
                    onChange={(e) => handleFormChange('severity', e.target.value)}
                  >
                    <option value="">Select severity</option>
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Reason <span className="oh-required">*</span></label>
                  <input 
                    type="text"
                    className="oh-form-input"
                    placeholder="Enter reason for disciplinary action"
                    value={createForm.reason}
                    onChange={(e) => handleFormChange('reason', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Description</label>
                  <textarea 
                    className="oh-form-textarea"
                    rows={3}
                    placeholder="Detailed description of the incident..."
                    value={createForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Action Date <span className="oh-required">*</span></label>
                  <input 
                    type="date"
                    className="oh-form-input"
                    value={createForm.actionDate}
                    onChange={(e) => handleFormChange('actionDate', e.target.value)}
                  />
                </div>
                
                <div className="oh-form-group">
                  <label className="oh-form-label">Effective Date</label>
                  <input 
                    type="date"
                    className="oh-form-input"
                    value={createForm.effectiveDate}
                    onChange={(e) => handleFormChange('effectiveDate', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Expiry Date</label>
                  <input 
                    type="date"
                    className="oh-form-input"
                    value={createForm.expiryDate}
                    onChange={(e) => handleFormChange('expiryDate', e.target.value)}
                  />
                </div>
                
                <div className="oh-form-group">
                  <label className="oh-form-label">Witnessed By</label>
                  <input 
                    type="text"
                    className="oh-form-input"
                    placeholder="Witness name"
                    value={createForm.witnessedBy}
                    onChange={(e) => handleFormChange('witnessedBy', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-checkbox">
                    <input 
                      type="checkbox"
                      checked={createForm.followUpRequired}
                      onChange={(e) => handleFormChange('followUpRequired', e.target.checked)}
                    />
                    <span className="oh-form-checkbox__checkmark"></span>
                    Follow-up required
                  </label>
                </div>

                {createForm.followUpRequired && (
                  <div className="oh-form-group oh-form-group--full-width">
                    <label className="oh-form-label">Follow-up Date</label>
                    <input 
                      type="date"
                      className="oh-form-input"
                      value={createForm.followUpDate}
                      onChange={(e) => handleFormChange('followUpDate', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="oh-modal-footer">
              <button 
                className="oh-btn oh-btn--secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="oh-btn oh-btn--primary"
                onClick={handleCreateAction}
                disabled={isLoading || !createForm.employee || !createForm.actionType || !createForm.reason || !createForm.actionDate}
              >
                {isLoading ? (
                  <>
                    <div className="oh-spinner"></div>
                    Creating...
                  </>
                ) : (
                  'Create Action'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinaryActions;
