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
  firstName: string;
  lastName: string;
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
    start_date: new Date().toISOString().split('T')[0],
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
    firstName: employee.firstName || employee.employee_first_name || '',
    lastName: employee.lastName || employee.employee_last_name || '',
    avatar: employee.avatar || employee.employee_profile || '',
    badgeId: employee.employeeId || employee.badge_id || '',
    department: employee.department || employee.department_name || '',
    position: employee.position || employee.job_position_name || ''
  });

  const transformDisciplinaryActionFromAPI = (apiAction: DisciplinaryActionAPI, employeesList: Employee[]): DisciplinaryAction => {
    const employee = employeesList.find(emp => apiAction.employee_id.includes(parseInt(emp.id))) || {
      id: apiAction.employee_id[0]?.toString() || '',
      name: 'Unknown Employee',
      firstName: '',
      lastName: '',
      avatar: '',
      badgeId: '',
      department: '',
      position: ''
    };

    // Map action type based on action ID or use default
    const actionTypeMapping: { [key: number]: string } = {
      1: 'verbal_warning',
      2: 'written_warning', 
      3: 'suspension',
      4: 'termination',
      5: 'performance_improvement'
    };
    
    const actionType = actionTypeMapping[apiAction.action] || 'written_warning';
    
    // Determine severity based on action type
    const severityMapping: { [key: string]: string } = {
      'verbal_warning': 'minor',
      'written_warning': 'moderate',
      'suspension': 'severe',
      'termination': 'critical',
      'performance_improvement': 'moderate'
    };

    return {
      id: apiAction.id.toString(),
      employee,
      actionType: actionType as any,
      reason: 'Policy Violation',
      description: apiAction.description,
      severity: severityMapping[actionType] as any || 'moderate',
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

  const transformDisciplinaryActionToAPI = async (formData: any) => {
    // Convert file to base64 if present
    let attachmentData = null;
    if (formData.attachment && formData.attachment instanceof File) {
      try {
        attachmentData = await fileToBase64(formData.attachment);
      } catch (error) {
        console.error('Error converting file to base64:', error);
        throw new Error('Failed to process file attachment');
      }
    }
    
    // Always use JSON payload
    return {
      description: formData.description,
      action: formData.action,
      employee_id: formData.employee_id,
      unit_in: formData.unit_in,
      days: formData.days,
      hours: formData.hours,
      start_date: formData.start_date,
      attachment: attachmentData
    };
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  // Error handling helper
  const handleApiError = (error: any, defaultMessage: string) => {
    if (error.message?.includes('401') || error.message?.includes('403')) {
      setError('Access denied. Please check your permissions.');
      // Could redirect to login here if needed
    } else if (error.message?.includes('400')) {
      setError('Invalid request. Please check your input and try again.');
    } else if (error.message?.includes('500')) {
      setError('Server error occurred. Please try again later.');
    } else {
      setError(defaultMessage);
    }
  };

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
      handleApiError(error, 'Failed to load disciplinary actions. Please try again.');
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
      handleApiError(error, 'Failed to load action types.');
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
    const today = new Date().toISOString().split('T')[0];
    setCreateForm({
      employee_id: [],
      action: 0,
      description: '',
      unit_in: 'days',
      days: 1,
      hours: '00:00',
      start_date: today,
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
    if (!createForm.description || !createForm.start_date || createForm.employee_id.length === 0 || !createForm.action) {
      setError('Please fill in all required fields: Employee, Action Type, Description, and Start Date');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const payload = await transformDisciplinaryActionToAPI(createForm);
      
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
      handleApiError(error, 'Failed to save disciplinary action. Please try again.');
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
      handleApiError(error, 'Failed to load disciplinary action details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    if (!window.confirm('Are you sure you want to delete this disciplinary action? This action cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteDisciplinaryAction(actionId);
      setSuccessMessage('Disciplinary action deleted.');
      
      // Refresh data
      await fetchDisciplinaryActions();
    } catch (error) {
      console.error('Error deleting disciplinary action:', error);
      handleApiError(error, 'Failed to delete disciplinary action. Please try again.');
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
                          <th>Employee</th>
                          <th>Action Taken</th>
                          <th>Login Block</th>
                          <th>Action Date</th>
                          <th>Attachments</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActions.map((action) => {
                          const actionType = actionTypes.find(type => type.id === action.action);
                          const employee = employees.find(emp => action.employee_id.includes(parseInt(emp.id)));
                          
                          return (
                            <tr key={action.id}>
                              <td>
                                {employee ? (
                                  <div className="employee-info">
                                    <div className="employee-avatar">
                                      {employee.firstName?.[0]}{employee.lastName?.[0]}
                                    </div>
                                    <span>{employee.firstName} {employee.lastName}</span>
                                    <button className="close-btn">×</button>
                                  </div>
                                ) : (
                                  'Unknown Employee'
                                )}
                              </td>
                              <td>{actionType?.title || 'Unknown Action'}</td>
                              <td>{actionType?.block_option ? 'Yes' : 'No'}</td>
                              <td>
                                {action.start_date ? 
                                  new Date(action.start_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  }).replace(',', '') : 'N/A'}
                              </td>
                              <td>
                                {action.attachment ? 
                                  action.attachment.split('/').pop() : 
                                  'No file has been uploaded.'}
                              </td>
                              <td>{action.description}</td>
                              <td>
                                <div className="action-buttons">
                                  <button 
                                    className="btn-icon edit"
                                    onClick={() => handleEditAction(action.id)}
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                  <button 
                                    className="btn-icon view"
                                    onClick={() => handleEditAction(action.id)}
                                    title="View"
                                  >
                                    📄
                                  </button>
                                  <button 
                                    className="btn-icon delete"
                                    onClick={() => handleDeleteAction(action.id)}
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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

      {/* Take An Action Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay">
          <div className="oh-create-rotating-modal">
            <div className="oh-modal-header">
              <h2 className="oh-modal-title">Take An Action.</h2>
              <button 
                className="oh-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="oh-modal-body">
              <div className="oh-form-grid">
                <div className="oh-form-group">
                  <label className="oh-form-label">Employees <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.employee_id.length > 0 ? createForm.employee_id[0] : ''}
                    onChange={(e) => handleFormChange('employee_id', e.target.value ? [parseInt(e.target.value)] : [])}
                  >
                    <option value="">Select employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Action <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.action}
                    onChange={(e) => handleFormChange('action', parseInt(e.target.value))}
                  >
                    <option value="">---Choose Action---</option>
                    {actionTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Description <span className="oh-required">*</span></label>
                  <textarea 
                    className="oh-form-textarea"
                    rows={3}
                    placeholder="Description"
                    value={createForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Start date <span className="oh-required">*</span></label>
                  <input 
                    type="date"
                    className="oh-form-input"
                    value={createForm.start_date}
                    onChange={(e) => handleFormChange('start_date', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Attachment</label>
                  <div className="file-input-wrapper">
                    <input 
                      type="file"
                      id="attachment-input"
                      className="oh-form-input file-input"
                      onChange={(e) => handleFormChange('attachment', e.target.files?.[0] || null)}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      style={{display: 'none'}}
                    />
                    <label htmlFor="attachment-input" className="file-input-label">
                      Choose File
                    </label>
                    <span className="file-input-text">
                      {createForm.attachment ? createForm.attachment.name : 'No file chosen'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="oh-modal-footer">
              <button 
                className="oh-btn oh-btn--danger save-btn"
                onClick={handleCreateAction}
                disabled={isLoading || createForm.employee_id.length === 0 || !createForm.action || !createForm.description || !createForm.start_date}
              >
                {isLoading ? (
                  <>
                    <div className="oh-spinner"></div>
                    Saving...
                  </>
                ) : (
                  'Save'
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
