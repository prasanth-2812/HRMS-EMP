import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import { useSidebar } from '../../../contexts/SidebarContext';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import { 
  getAllDisciplinaryActions, 
  getDisciplinaryActionById, 
  createDisciplinaryAction, 
  updateDisciplinaryAction, 
  deleteDisciplinaryAction,
  getAllEmployees,
  getAllDisciplinaryActionTypes
} from '../../../services/employeeService';
import './DisciplinaryActions.css';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  department: string;
  position: string;
}

// Backend API response interface
interface DisciplinaryActionAPI {
  id: number;
  created_at: string;
  is_active: boolean;
  description: string;
  unit_in: 'days' | 'hours';
  days: number;
  hours: string;
  start_date: string;
  attachment: string | null;
  created_by: number;
  modified_by: number;
  action: number;
  employee_id: number[];
}

// Frontend interface for display
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
  // Backend fields
  unit_in: 'days' | 'hours';
  days: number;
  hours: string;
  start_date: string;
  attachment: string | null;
  action: number;
  employee_id: number[];
}

const DisciplinaryActions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [disciplinaryActions, setDisciplinaryActions] = useState<DisciplinaryAction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [actionTypes, setActionTypes] = useState<any[]>([]);
  const [editingAction, setEditingAction] = useState<DisciplinaryAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    employee_id: [] as number[],
    action: 0,
    description: '',
    unit_in: 'days' as 'days' | 'hours',
    days: 1,
    hours: '00:00',
    start_date: '',
    attachment: null as File | null,
    // Legacy fields for UI compatibility
    employee: '',
    actionType: '',
    reason: '',
    severity: '',
    actionDate: '',
    effectiveDate: '',
    expiryDate: '',
    witnessedBy: '',
    followUpRequired: false,
    followUpDate: ''
  });
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Data transformation functions
  const transformEmployeeData = (employee: any): Employee => ({
    id: employee.id?.toString() || '',
    name: `${employee.firstName || employee.employee_first_name || ''} ${employee.lastName || employee.employee_last_name || ''}`.trim(),
    avatar: employee.avatar || employee.employee_profile || '',
    badgeId: employee.employeeId || employee.badge_id || '',
    department: employee.department || employee.department_name || '',
    position: employee.position || employee.job_position_name || ''
  });

  const transformDisciplinaryActionFromAPI = (apiAction: DisciplinaryActionAPI, employeesList: Employee[]): DisciplinaryAction => {
    const employee = employeesList.find(emp => apiAction.employee_id.includes(parseInt(emp.id))) || {
      id: apiAction.employee_id[0]?.toString() || '',
      name: 'Unknown Employee',
      avatar: '',
      badgeId: '',
      department: '',
      position: ''
    };

    return {
      id: apiAction.id.toString(),
      employee,
      actionType: 'written_warning', // Default mapping - should be enhanced with action type lookup
      reason: 'Policy Violation', // Default - could be derived from action type
      description: apiAction.description,
      severity: 'moderate', // Default - could be derived from action type
      actionDate: apiAction.start_date,
      effectiveDate: apiAction.start_date,
      expiryDate: undefined,
      issuedBy: 'System',
      witnessedBy: undefined,
      status: apiAction.is_active ? 'active' : 'completed',
      appealDate: undefined,
      appealReason: undefined,
      followUpRequired: false,
      followUpDate: undefined,
      documents: apiAction.attachment ? [apiAction.attachment] : [],
      // Backend fields
      unit_in: apiAction.unit_in,
      days: apiAction.days,
      hours: apiAction.hours,
      start_date: apiAction.start_date,
      attachment: apiAction.attachment,
      action: apiAction.action,
      employee_id: apiAction.employee_id
    };
  };

  const transformDisciplinaryActionToAPI = (formData: any) => ({
    description: formData.description,
    unit_in: formData.unit_in,
    days: formData.days,
    hours: formData.hours,
    start_date: formData.start_date,
    attachment: formData.attachment,
    action: formData.action,
    employee_id: formData.employee_id
  });

  // API functions
  const fetchDisciplinaryActions = async () => {
    try {
      setIsDataLoading(true);
      setError(null);
      const response = await getAllDisciplinaryActions() as any;
      const employeesResponse = await getAllEmployees() as any;
      
      const transformedEmployees = (employeesResponse?.results || employeesResponse || []).map(transformEmployeeData);
      setEmployees(transformedEmployees);

      if (response?.results) {
        const transformedActions = response.results.map((action: DisciplinaryActionAPI) =>
          transformDisciplinaryActionFromAPI(action, transformedEmployees)
        );
        setDisciplinaryActions(transformedActions);
      }
    } catch (error) {
      console.error('Error fetching disciplinary actions:', error);
      setError('Failed to load disciplinary actions. Please try again.');
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchActionTypes = async () => {
    try {
      const response = await getAllDisciplinaryActionTypes() as any;
      if (response?.results) {
        setActionTypes(response.results);
      }
    } catch (error) {
      console.error('Error fetching action types:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDisciplinaryActions();
    fetchActionTypes();
  }, []);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Filter and search logic
  const filteredActions = useMemo(() => {
    return disciplinaryActions.filter(action => {
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
  }, [disciplinaryActions, searchTerm, statusFilter, severityFilter, actionTypeFilter, departmentFilter]);

  // Form handling functions
  const handleFormChange = (field: string, value: string | boolean | number | number[] | File | null) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setCreateForm({
      employee_id: [],
      action: 0,
      description: '',
      unit_in: 'days',
      days: 1,
      hours: '00:00',
      start_date: '',
      attachment: null,
      // Legacy fields for UI compatibility
      employee: '',
      actionType: '',
      reason: '',
      severity: '',
      actionDate: '',
      effectiveDate: '',
      expiryDate: '',
      witnessedBy: '',
      followUpRequired: false,
      followUpDate: ''
    });
    setEditingAction(null);
  };

  const handleCreateAction = async () => {
    if (!createForm.description || !createForm.start_date || createForm.employee_id.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload = transformDisciplinaryActionToAPI(createForm);
      
      if (editingAction) {
        // Update existing action
        await updateDisciplinaryAction(editingAction.id, payload);
        setSuccessMessage('Disciplinary action updated successfully');
      } else {
        // Create new action
        await createDisciplinaryAction(payload);
        setSuccessMessage('Disciplinary action created successfully');
      }
      
      // Refresh data
      await fetchDisciplinaryActions();
      
      // Reset form and close modal
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving disciplinary action:', error);
      setError('Failed to save disciplinary action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAction = async (actionId: string) => {
    try {
      setIsLoading(true);
      const response = await getDisciplinaryActionById(actionId);
      const transformedAction = transformDisciplinaryActionFromAPI(response as DisciplinaryActionAPI, employees);
      
      setEditingAction(transformedAction);
      setCreateForm({
        employee_id: transformedAction.employee_id,
        action: transformedAction.action,
        description: transformedAction.description,
        unit_in: transformedAction.unit_in,
        days: transformedAction.days,
        hours: transformedAction.hours,
        start_date: transformedAction.start_date,
        attachment: null, // File inputs can't be pre-filled
        // Legacy fields for UI compatibility
        employee: transformedAction.employee.id,
        actionType: transformedAction.actionType,
        reason: transformedAction.reason,
        severity: transformedAction.severity,
        actionDate: transformedAction.actionDate,
        effectiveDate: transformedAction.effectiveDate,
        expiryDate: transformedAction.expiryDate || '',
        witnessedBy: transformedAction.witnessedBy || '',
        followUpRequired: transformedAction.followUpRequired,
        followUpDate: transformedAction.followUpDate || ''
      });
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error fetching disciplinary action:', error);
      setError('Failed to load disciplinary action details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    if (!window.confirm('Are you sure you want to delete this disciplinary action?')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteDisciplinaryAction(actionId);
      setSuccessMessage('Disciplinary action deleted successfully');
      
      // Refresh data
      await fetchDisciplinaryActions();
    } catch (error) {
      console.error('Error deleting disciplinary action:', error);
      setError('Failed to delete disciplinary action. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const total = disciplinaryActions.length;
    const active = disciplinaryActions.filter(a => a.status === 'active').length;
    const pending = disciplinaryActions.filter(a => a.status === 'pending').length;
    const appealed = disciplinaryActions.filter(a => a.status === 'appealed').length;
    const followUpRequired = disciplinaryActions.filter(a => a.followUpRequired && a.status === 'active').length;
    
    return { total, active, pending, appealed, followUpRequired };
  }, [disciplinaryActions]);

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
        <Header toggleSidebar={toggleSidebar} />
        <div className="da-content">
          <div className="oh-container">
            {/* Success Message */}
            {successMessage && (
              <div className="oh-alert oh-alert--success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                {successMessage}
                <button 
                  className="oh-alert__close"
                  onClick={() => setSuccessMessage(null)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="oh-alert oh-alert--error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                {error}
                <button 
                  className="oh-alert__close"
                  onClick={() => setError(null)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}

            {/* Header Section */}
            <div className="oh-page-header">
              <div className="oh-page-header__content">
                <h1 className="oh-page-title">Disciplinary Actions</h1>
                <p className="oh-page-subtitle">Manage and track employee disciplinary actions</p>
              </div>
              <div className="oh-page-header__actions">
                <button 
                  className="oh-btn oh-btn--primary"
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  disabled={isLoading}
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
              {isDataLoading ? (
                <div className="oh-loading-state">
                  <div className="oh-spinner"></div>
                  <p>Loading disciplinary actions...</p>
                </div>
              ) : (
                <>
                  <div className="oh-table-container">
                    <table className="oh-table">
                      <thead>
                        <tr>
                          <th>Action ID</th>
                          <th>Employee</th>
                          <th>Description</th>
                          <th>Unit</th>
                          <th>Duration</th>
                          <th>Start Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActions.map((action) => (
                          <tr key={action.id}>
                            <td>
                              <span className="oh-action-id">DA-{action.id}</span>
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
                            <td>
                              <div className="oh-reason-info">
                                <div className="oh-reason-desc">{action.description.substring(0, 80)}...</div>
                              </div>
                            </td>
                            <td>
                              <span className="oh-unit-badge">{action.unit_in}</span>
                            </td>
                            <td>
                              {action.unit_in === 'days' ? `${action.days} days` : action.hours}
                            </td>
                            <td>{formatDate(action.start_date)}</td>
                            <td>{getStatusBadge(action.status)}</td>
                            <td>
                              <div className="oh-actions">
                                <button 
                                  className="oh-btn oh-btn--sm oh-btn--ghost"
                                  onClick={() => handleEditAction(action.id)}
                                  disabled={isLoading}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="oh-btn oh-btn--sm oh-btn--danger"
                                  onClick={() => handleDeleteAction(action.id)}
                                  disabled={isLoading}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredActions.length === 0 && !isDataLoading && (
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
                </>
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
                    value={createForm.employee_id.length > 0 ? createForm.employee_id[0] : ''}
                    onChange={(e) => handleFormChange('employee_id', e.target.value ? [parseInt(e.target.value)] : [])}
                  >
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.badgeId} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Action Type <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.action}
                    onChange={(e) => handleFormChange('action', parseInt(e.target.value))}
                  >
                    <option value="">Select action type</option>
                    {actionTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="oh-form-group">
                  <label className="oh-form-label">Unit <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.unit_in}
                    onChange={(e) => handleFormChange('unit_in', e.target.value)}
                  >
                    <option value="">Select unit</option>
                    <option value="days">Days</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Days</label>
                  <input 
                    type="number"
                    className="oh-form-input"
                    placeholder="Number of days"
                    value={createForm.days}
                    onChange={(e) => handleFormChange('days', parseInt(e.target.value) || 1)}
                    min="0"
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Hours</label>
                  <input 
                    type="time"
                    className="oh-form-input"
                    value={createForm.hours}
                    onChange={(e) => handleFormChange('hours', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Start Date <span className="oh-required">*</span></label>
                  <input 
                    type="date"
                    className="oh-form-input"
                    value={createForm.start_date}
                    onChange={(e) => handleFormChange('start_date', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Description <span className="oh-required">*</span></label>
                  <textarea 
                    className="oh-form-textarea"
                    rows={3}
                    placeholder="Detailed description of the incident..."
                    value={createForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Attachment</label>
                  <input 
                    type="file"
                    className="oh-form-input"
                    onChange={(e) => handleFormChange('attachment', e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>

                {/* Legacy fields for UI compatibility */}
                <div className="oh-form-group">
                  <label className="oh-form-label">Severity</label>
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

                <div className="oh-form-group">
                  <label className="oh-form-label">Reason</label>
                  <input 
                    type="text"
                    className="oh-form-input"
                    placeholder="Enter reason for disciplinary action"
                    value={createForm.reason}
                    onChange={(e) => handleFormChange('reason', e.target.value)}
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
                disabled={isLoading || createForm.employee_id.length === 0 || !createForm.action || !createForm.description || !createForm.start_date}
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

      <QuickAccess />
    </div>
  );
};

export default DisciplinaryActions;
