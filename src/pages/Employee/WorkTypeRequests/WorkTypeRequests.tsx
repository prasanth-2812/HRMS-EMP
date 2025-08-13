import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import { useSidebar } from '../../../contexts/SidebarContext';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import './WorkTypeRequests.css';
import {
  getWorkTypeRequests,
  createWorkTypeRequest,
  updateWorkTypeRequest,
  deleteWorkTypeRequest,
  WorkTypeRequest as ApiWorkTypeRequest,
  CreateWorkTypeRequestData
} from '../../../services/workTypeRequestsApi';

interface WorkTypeRequest {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  work_type_name: string;
  previous_work_type_name: string | null;
  created_at: string;
  is_active: boolean;
  requested_date: string;
  requested_till: string;
  description: string;
  is_permanent_work_type: boolean;
  approved: boolean;
  canceled: boolean;
  work_type_changed: boolean;
  created_by: number;
  modified_by: number;
  employee_id: number;
  work_type_id: number;
  previous_work_type_id: number | null;
}

interface CreateWorkTypeRequestForm {
  employee_id: string;
  work_type_id: string;
  requested_date: string;
  requested_till: string;
  description: string;
  is_permanent_work_type: boolean;
}

const WorkTypeRequests: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<WorkTypeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateWorkTypeRequestForm>({
    employee_id: '',
    work_type_id: '',
    requested_date: '',
    requested_till: '',
    description: '',
    is_permanent_work_type: false
  });
  
  const { isCollapsed, toggleSidebar } = useSidebar();

  // API functions
  const fetchWorkTypeRequests = async () => {
    try {
      setLoading(true);
      const response = await getWorkTypeRequests();
      setRequests(response.results);
    } catch (error) {
      console.error('Error fetching work type requests:', error);
      showNotification('error', 'Failed to load work type requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkTypeRequest = async () => {
    try {
      setIsLoading(true);
      const requestData: CreateWorkTypeRequestData = {
        employee_id: parseInt(createForm.employee_id),
        work_type_id: parseInt(createForm.work_type_id),
        requested_date: createForm.requested_date,
        requested_till: createForm.requested_till,
        description: createForm.description,
        is_permanent_work_type: createForm.is_permanent_work_type
      };
      
      await createWorkTypeRequest(requestData);
      await fetchWorkTypeRequests();
      setShowCreateModal(false);
      setCreateForm({
        employee_id: '',
        work_type_id: '',
        requested_date: '',
        requested_till: '',
        description: '',
        is_permanent_work_type: false
      });
      showNotification('success', 'Work type request created successfully');
    } catch (error) {
      console.error('Error creating work type request:', error);
      showNotification('error', 'Failed to create work type request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRequest = async (id: number, updateData: { approved?: boolean; canceled?: boolean }) => {
    try {
      await updateWorkTypeRequest(id, updateData);
      await fetchWorkTypeRequests();
      const action = updateData.approved ? 'approved' : 'rejected';
      showNotification('success', `Work type request ${action} successfully`);
    } catch (error) {
      console.error('Error updating work type request:', error);
      showNotification('error', 'Failed to update work type request');
    }
  };

  const handleDeleteRequest = async (id: number) => {
    try {
      await deleteWorkTypeRequest(id);
      await fetchWorkTypeRequests();
      showNotification('success', 'Work type request deleted successfully');
    } catch (error) {
      console.error('Error deleting work type request:', error);
      showNotification('error', 'Failed to delete work type request');
    }
  };

  useEffect(() => {
    fetchWorkTypeRequests();
  }, []);

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = `${request.employee_first_name} ${request.employee_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.id.toString().includes(searchTerm.toLowerCase()) ||
                          request.work_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const status = getStatusText(request);
      const matchesStatus = statusFilter === 'all' || status.toLowerCase() === statusFilter;
      const matchesType = typeFilter === 'all' || 
                         (typeFilter === 'permanent' && request.is_permanent_work_type) ||
                         (typeFilter === 'temporary' && !request.is_permanent_work_type);
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [requests, searchTerm, statusFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => !r.approved && !r.canceled).length;
    const approved = requests.filter(r => r.approved).length;
    const rejected = requests.filter(r => r.canceled).length;
    
    return { total, pending, approved, rejected };
  }, [requests]);

  // Helper functions
  const getStatusText = (request: WorkTypeRequest): string => {
    if (request.approved) return 'approved';
    if (request.canceled) return 'rejected';
    return 'pending';
  };

  const getStatusClass = (request: WorkTypeRequest): string => {
    if (request.approved) return 'oh-status--approved';
    if (request.canceled) return 'oh-status--rejected';
    return 'oh-status--pending';
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'oh-status-badge oh-status-badge--pending',
      approved: 'oh-status-badge oh-status-badge--approved',
      rejected: 'oh-status-badge oh-status-badge--rejected'
    };
    
    return (
      <span className={statusClasses[status as keyof typeof statusClasses]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityClasses = {
      low: 'oh-priority-badge oh-priority-badge--low',
      medium: 'oh-priority-badge oh-priority-badge--medium',
      high: 'oh-priority-badge oh-priority-badge--high'
    };
    
    return (
      <span className={priorityClasses[priority as keyof typeof priorityClasses]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
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

  // Helper function for notifications
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle form input changes
  const handleFormChange = (field: keyof CreateWorkTypeRequestForm, value: string | boolean) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Close notification
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="oh-dashboard">
      <Sidebar />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="oh-content">
          <div className="oh-container">
            {/* Header Section */}
            <div className="oh-page-header">
              <div className="oh-page-header__content">
                <h1 className="oh-page-title">Work Type Requests</h1>
                <p className="oh-page-subtitle">Manage and track work type change requests</p>
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
                  Create Request
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
                  <div className="oh-stat-card__label">Total Requests</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--pending">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.pending}</div>
                  <div className="oh-stat-card__label">Pending</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--approved">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,11 12,14 22,4"></polyline>
                    <path d="m21,4 0,7 -5,0"></path>
                    <path d="M5.5,7 8.5,7"></path>
                    <path d="M7,16 l-1.5,0 0,-4.5"></path>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.approved}</div>
                  <div className="oh-stat-card__label">Approved</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--rejected">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.rejected}</div>
                  <div className="oh-stat-card__label">Rejected</div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="oh-controls">
              <div className="oh-controls__left">
                <div className="oh-view-toggle">
                  <button 
                    className={`oh-view-toggle__btn ${viewMode === 'table' ? 'oh-view-toggle__btn--active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M3 12h18M3 18h18"></path>
                    </svg>
                  </button>
                  <button 
                    className={`oh-view-toggle__btn ${viewMode === 'grid' ? 'oh-view-toggle__btn--active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </button>
                </div>

                <div className="oh-search-field">
                  <svg className="oh-search-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    className="oh-search-field__input"
                    placeholder="Search requests..."
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
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select 
                  className="oh-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="temporary">Temporary</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>
            </div>

            {/* Content Area */}
            <div className="oh-content-area">
              {viewMode === 'table' ? (
                <div className="oh-table-container">
                  <table className="oh-table">
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Employee</th>
                        <th>Current Work Type</th>
                        <th>Requested Work Type</th>
                        <th>Type</th>
                        <th>Effective Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((request) => (
                        <tr key={request.id}>
                          <td>
                            <span className="oh-request-id">{request.id}</span>
                          </td>
                          <td>
                            <div className="oh-employee-info">
                              <div className="oh-employee-avatar">
                                {request.employee_first_name.charAt(0)}
                              </div>
                              <div className="oh-employee-details">
                                <div className="oh-employee-name">{request.employee_first_name} {request.employee_last_name}</div>
                                <div className="oh-employee-badge">ID: {request.employee_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="oh-work-type">
                              <div className="oh-work-type__name">{request.previous_work_type_name || 'N/A'}</div>
                            </div>
                          </td>
                          <td>
                            <div className="oh-work-type">
                              <div className="oh-work-type__name">{request.work_type_name}</div>
                            </div>
                          </td>
                          <td>
                            <span className={`oh-type-badge oh-type-badge--${request.is_permanent_work_type ? 'permanent' : 'temporary'}`}>
                              {request.is_permanent_work_type ? 'Permanent' : 'Temporary'}
                            </span>
                          </td>
                          <td>{formatDate(request.requested_date)}</td>
                          <td>{getPriorityBadge('medium')}</td>
                          <td>{getStatusBadge(getStatusText(request))}</td>
                          <td>
                            <div className="oh-actions">
                              <button className="oh-btn oh-btn--sm oh-btn--ghost">View</button>
                              {getStatusText(request) === 'pending' && (
                                <>
                                  <button 
                                    className="oh-btn oh-btn--sm oh-btn--success"
                                    onClick={() => handleUpdateRequest(request.id, { approved: true })}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    className="oh-btn oh-btn--sm oh-btn--danger"
                                    onClick={() => handleUpdateRequest(request.id, { canceled: true })}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button 
                                className="oh-btn oh-btn--sm oh-btn--danger"
                                onClick={() => handleDeleteRequest(request.id)}
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
              ) : (
                <div className="oh-grid-view">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="oh-request-card">
                      <div className="oh-request-card__header">
                        <div className="oh-request-card__id">{request.id}</div>
                        <div className="oh-request-card__status">
                          {getStatusBadge(getStatusText(request))}
                        </div>
                      </div>
                      
                      <div className="oh-request-card__employee">
                        <div className="oh-employee-avatar">
                          {request.employee_first_name.charAt(0)}
                        </div>
                        <div className="oh-employee-details">
                          <div className="oh-employee-name">{request.employee_first_name} {request.employee_last_name}</div>
                          <div className="oh-employee-badge">ID: {request.employee_id}</div>
                        </div>
                      </div>

                      <div className="oh-request-card__work-types">
                        <div className="oh-work-type-change">
                          <div className="oh-work-type-from">
                            <span className="oh-work-type-label">From:</span>
                            <span className="oh-work-type-name">{request.previous_work_type_name || 'N/A'}</span>
                          </div>
                          <div className="oh-work-type-arrow">→</div>
                          <div className="oh-work-type-to">
                            <span className="oh-work-type-label">To:</span>
                            <span className="oh-work-type-name">{request.work_type_name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="oh-request-card__meta">
                        <div className="oh-meta-item">
                          <span className="oh-meta-label">Type:</span>
                          <span className={`oh-type-badge oh-type-badge--${request.is_permanent_work_type ? 'permanent' : 'temporary'}`}>
                            {request.is_permanent_work_type ? 'Permanent' : 'Temporary'}
                          </span>
                        </div>
                        <div className="oh-meta-item">
                          <span className="oh-meta-label">Priority:</span>
                          {getPriorityBadge('medium')}
                        </div>
                        <div className="oh-meta-item">
                          <span className="oh-meta-label">Effective:</span>
                          <span>{formatDate(request.requested_date)}</span>
                        </div>
                      </div>

                      <div className="oh-request-card__reason">
                        <span className="oh-reason-label">Description:</span>
                        <p className="oh-reason-text">{request.description}</p>
                      </div>

                      <div className="oh-request-card__footer">
                        <div className="oh-request-date">
                          Created: {formatDate(request.created_at)}
                        </div>
                        <div className="oh-request-actions">
                          <button className="oh-btn oh-btn--sm oh-btn--ghost">View</button>
                          {getStatusText(request) === 'pending' && (
                            <>
                              <button 
                                className="oh-btn oh-btn--sm oh-btn--success"
                                onClick={() => handleUpdateRequest(request.id, { approved: true })}
                              >
                                Approve
                              </button>
                              <button 
                                className="oh-btn oh-btn--sm oh-btn--danger"
                                onClick={() => handleUpdateRequest(request.id, { canceled: true })}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            className="oh-btn oh-btn--sm oh-btn--danger"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredRequests.length === 0 && (
                <div className="oh-empty-state">
                  <div className="oh-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <h3 className="oh-empty-state__title">No work type requests found</h3>
                  <p className="oh-empty-state__message">
                    There are currently no work type requests to consider.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Work Type Request Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="oh-create-worktype-modal" onClick={(e) => e.stopPropagation()}>
            <div className="oh-modal-header">
              <h2 className="oh-modal-title">Create Work Type Request</h2>
              <button 
                className="oh-modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="oh-modal-body">
              <div className="oh-form-grid">
                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Employee ID <span className="oh-required">*</span>
                  </label>
                  <input
                    type="number"
                    className="oh-form-input"
                    value={createForm.employee_id}
                    onChange={(e) => handleFormChange('employee_id', e.target.value)}
                    placeholder="Enter employee ID"
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Work Type ID <span className="oh-required">*</span>
                  </label>
                  <input
                    type="number"
                    className="oh-form-input"
                    value={createForm.work_type_id}
                    onChange={(e) => handleFormChange('work_type_id', e.target.value)}
                    placeholder="Enter work type ID"
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Requested Date <span className="oh-required">*</span>
                  </label>
                  <input
                    type="date"
                    className="oh-form-input"
                    value={createForm.requested_date}
                    onChange={(e) => handleFormChange('requested_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Requested Till <span className="oh-required">*</span>
                  </label>
                  <input
                    type="date"
                    className="oh-form-input"
                    value={createForm.requested_till}
                    onChange={(e) => handleFormChange('requested_till', e.target.value)}
                    min={createForm.requested_date || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Permanent Work Type
                  </label>
                  <label className="oh-checkbox">
                    <input
                      type="checkbox"
                      checked={createForm.is_permanent_work_type}
                      onChange={(e) => handleFormChange('is_permanent_work_type', e.target.checked)}
                    />
                    <span className="oh-checkbox-label">This is a permanent work type change</span>
                  </label>
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">
                    Description <span className="oh-required">*</span>
                  </label>
                  <textarea
                    className="oh-form-textarea"
                    rows={4}
                    placeholder="Provide description for work type change request..."
                    value={createForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="oh-modal-footer">
              <button 
                className="oh-btn oh-btn--secondary"
                onClick={() => setShowCreateModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="oh-btn oh-btn--primary"
                onClick={handleCreateWorkTypeRequest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="oh-spinner"></div>
                    Creating...
                  </>
                ) : (
                  'Create Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`oh-notification oh-notification--${notification.type}`}>
          <div className="oh-notification-content">
            <div className="oh-notification-icon">
              {notification.type === 'success' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              )}
              {notification.type === 'error' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}

            </div>
            <span className="oh-notification-message">{notification.message}</span>
            <button 
              className="oh-notification-close"
              onClick={closeNotification}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      <QuickAccess />
    </div>
  );
};

export default WorkTypeRequests;
