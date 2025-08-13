import React, { useState, useMemo, useEffect } from 'react';
import './ShiftRequests.css';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../../contexts/SidebarContext';
import {
  getShiftRequests,
  createShiftRequest,
  updateShiftRequest,
  deleteShiftRequest,
  ShiftRequest as ApiShiftRequest,
  CreateShiftRequestData
} from '../../../services/shiftRequestsApi';
import { getAllShifts, Shift } from '../../../services/shiftService';
import { getAllEmployees } from '../../../services/employeeService';

// Updated interface to match API response
interface ShiftRequest {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  shift_name: string;
  previous_shift_name: string | null;
  created_at: string;
  is_active: boolean;
  requested_date: string;
  reallocate_approved: boolean;
  reallocate_canceled: boolean;
  requested_till: string;
  description: string;
  is_permanent_shift: boolean;
  approved: boolean;
  canceled: boolean;
  shift_changed: boolean;
  created_by: number;
  modified_by: number;
  employee_id: number;
  shift_id: number;
  previous_shift_id: number | null;
  reallocate_to: number | null;
}

interface CreateShiftRequestForm {
  employee_id: string;
  shift_id: string;
  requested_date: string;
  requested_till: string;
  description: string;
  is_permanent_shift: boolean;
}

// Remove mock data - will be fetched from API

const ShiftRequests: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortField, setSortField] = useState<keyof ShiftRequest>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<ShiftRequest[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateShiftRequestForm>({
    employee_id: '',
    shift_id: '',
    requested_date: '',
    requested_till: '',
    description: '',
    is_permanent_shift: false
  });
  
  // State for dropdown options
  const [employees, setEmployees] = useState<any[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  // Fetch shift requests from API
  const fetchShiftRequests = async () => {
    setIsLoading(true);
    try {
      const response = await getShiftRequests();
      setRequests(response.results);
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to fetch shift requests'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employees for dropdown
  const fetchEmployees = async () => {
    try {
      const employeeData = await getAllEmployees();
      setEmployees(employeeData);
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to fetch employees'
      });
    }
  };

  // Fetch shifts for dropdown
  const fetchShifts = async () => {
    try {
      const shiftData = await getAllShifts();
      setShifts(shiftData);
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to fetch shifts'
      });
    }
  };

  // Fetch dropdown data
  const fetchDropdownData = async () => {
    setLoadingDropdowns(true);
    try {
      await Promise.all([fetchEmployees(), fetchShifts()]);
    } finally {
      setLoadingDropdowns(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchShiftRequests();
    fetchDropdownData();
  }, []);

  const filteredRequests = requests.filter(request => {
    const fullName = `${request.employee_first_name} ${request.employee_last_name}`;
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.shift_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = request.approved ? 'approved' : request.canceled ? 'rejected' : 'pending';
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedRequests = filteredRequests.sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc' 
      ? (aValue as any) - (bValue as any)
      : (bValue as any) - (aValue as any);
  });

  const getStatusClass = (request: ShiftRequest) => {
    if (request.approved) return 'oh-status--approved';
    if (request.canceled) return 'oh-status--rejected';
    return 'oh-status--pending';
  };

  const getStatusText = (request: ShiftRequest) => {
    if (request.approved) return 'Approved';
    if (request.canceled) return 'Rejected';
    return 'Pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handle form submission
  const handleCreateShiftRequest = async () => {
    if (!createForm.employee_id || !createForm.shift_id || !createForm.requested_date) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const requestData: CreateShiftRequestData = {
        employee_id: parseInt(createForm.employee_id),
        shift_id: parseInt(createForm.shift_id),
        requested_date: createForm.requested_date,
        requested_till: createForm.requested_till,
        description: createForm.description,
        is_permanent_shift: createForm.is_permanent_shift
      };

      await createShiftRequest(requestData);
      
      // Reset form
      setCreateForm({
        employee_id: '',
        shift_id: '',
        requested_date: '',
        requested_till: '',
        description: '',
        is_permanent_shift: false
      });
      
      setShowCreateModal(false);
      setNotification({
        type: 'success',
        message: 'Shift request created successfully!'
      });
      
      // Refresh the list
      await fetchShiftRequests();
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to create shift request. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete request
  const handleDeleteRequest = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this shift request?')) {
      return;
    }

    try {
      await deleteShiftRequest(id);
      setNotification({
        type: 'success',
        message: 'Shift request deleted successfully!'
      });
      await fetchShiftRequests();
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to delete shift request'
      });
    }
  };

  // Handle approve/reject request
  const handleUpdateRequest = async (id: number, approved: boolean) => {
    try {
      await updateShiftRequest(id, { approved, canceled: !approved });
      setNotification({
        type: 'success',
        message: `Shift request ${approved ? 'approved' : 'rejected'} successfully!`
      });
      await fetchShiftRequests();
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Failed to update shift request'
      });
    }
  };

  // Handle form input changes
  const handleFormChange = (field: keyof CreateShiftRequestForm, value: string | boolean) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Close notification
  const closeNotification = () => {
    setNotification(null);
  };

  // Auto-close notification after 5 seconds
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        closeNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="oh-wrapper">
      <Sidebar />
      <div className="oh-main">
        <Header toggleSidebar={toggleSidebar} />
        <div className="oh-main-content">
          <div className="oh-shift-requests">
            {/* Header */}
            <div className="oh-shift-requests__header">
              <div className="oh-shift-requests__header-left">
                <h1 className="oh-shift-requests__title">Shift Requests</h1>
                <p className="oh-shift-requests__subtitle">
                  Manage and track employee shift change requests
                </p>
              </div>
              <div className="oh-shift-requests__header-right">
                <button 
                  className="oh-btn oh-btn--primary oh-btn--icon"
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

            {/* Filters */}
            <div className="oh-shift-requests__filters">
              <div className="oh-shift-requests__filters-left">
                <div className="oh-search-field">
                  <svg className="oh-search-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search shift requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="oh-search-field__input"
                  />
                </div>
                
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="oh-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>


              </div>

              <div className="oh-shift-requests__filters-right">
                <div className="oh-view-toggle">
                  <button 
                    className={`oh-view-toggle__btn ${viewMode === 'table' ? 'oh-view-toggle__btn--active' : ''}`}
                    onClick={() => setViewMode('table')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h18v18H3z"></path>
                      <path d="M9 9h12v12H9z"></path>
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
              </div>
            </div>

            {/* Content */}
            <div className="oh-shift-requests__content">
              {viewMode === 'table' ? (
                <div className="oh-table-wrapper">
                  <table className="oh-table">
                    <thead className="oh-table__head">
                      <tr className="oh-table__row">
                        <th className="oh-table__header">Employee</th>
                        <th className="oh-table__header">From Shift</th>
                        <th className="oh-table__header">To Shift</th>
                        <th className="oh-table__header">Shift Date</th>
                        <th className="oh-table__header">Type</th>
                        <th className="oh-table__header">Status</th>
                        <th className="oh-table__header">Reason</th>
                        <th className="oh-table__header">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="oh-table__body">
                      {sortedRequests.map((request) => (
                        <tr key={request.id} className="oh-table__row">
                          <td className="oh-table__cell">
                            <div className="oh-employee-info">
                              <div className="oh-employee-info__avatar">
                                {request.employee_first_name.charAt(0)}{request.employee_last_name.charAt(0)}
                              </div>
                              <div className="oh-employee-info__details">
                                <span className="oh-employee-info__name">{request.employee_first_name} {request.employee_last_name}</span>
                                <span className="oh-employee-info__badge">EMP-{request.employee_id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="oh-table__cell">
                            <div className="oh-shift-info">
                              <span className="oh-shift-info__name">{request.previous_shift_name || 'N/A'}</span>
                              <span className="oh-shift-info__time">Previous Shift</span>
                            </div>
                          </td>
                          <td className="oh-table__cell">
                            <div className="oh-shift-info">
                              <span className="oh-shift-info__name">{request.shift_name}</span>
                              <span className="oh-shift-info__time">Requested Shift</span>
                            </div>
                          </td>
                          <td className="oh-table__cell">
                            <span className="oh-date">{formatDate(request.requested_date)}</span>
                          </td>
                          <td className="oh-table__cell">
                            <span className={`oh-priority ${request.is_permanent_shift ? 'oh-priority--high' : 'oh-priority--medium'}`}>
                              {request.is_permanent_shift ? 'Permanent' : 'Temporary'}
                            </span>
                          </td>
                          <td className="oh-table__cell">
                            <span className={`oh-status ${getStatusClass(request)}`}>
                              {getStatusText(request)}
                            </span>
                          </td>
                          <td className="oh-table__cell">
                            <span className="oh-reason" title={request.description}>
                              {request.description.length > 30 ? `${request.description.substring(0, 30)}...` : request.description}
                            </span>
                          </td>
                          <td className="oh-table__cell">
                            <div className="oh-table__actions">
                              <button className="oh-btn oh-btn--icon oh-btn--sm" title="View Details">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                              {!request.approved && !request.canceled && (
                                <>
                                  <button 
                                    className="oh-btn oh-btn--icon oh-btn--sm oh-btn--success" 
                                    title="Approve"
                                    onClick={() => handleUpdateRequest(request.id, true)}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="20,6 9,17 4,12"></polyline>
                                    </svg>
                                  </button>
                                  <button 
                                    className="oh-btn oh-btn--icon oh-btn--sm oh-btn--danger" 
                                    title="Reject"
                                    onClick={() => handleUpdateRequest(request.id, false)}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </button>
                                </>
                              )}
                              <button 
                                className="oh-btn oh-btn--icon oh-btn--sm" 
                                title="Delete"
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="oh-grid">
                  {sortedRequests.map((request) => (
                    <div key={request.id} className="oh-shift-requests__card">
                      <div className="oh-shift-requests__card-header">
                        <div className="oh-employee-info">
                          <div className="oh-employee-info__avatar">
                            {request.employee_first_name.charAt(0)}{request.employee_last_name.charAt(0)}
                          </div>
                          <div className="oh-employee-info__details">
                            <span className="oh-employee-info__name">{request.employee_first_name} {request.employee_last_name}</span>
                            <span className="oh-employee-info__badge">EMP-{request.employee_id}</span>
                          </div>
                        </div>
                        <div className="oh-shift-requests__card-badges">
                          <span className={`oh-priority ${request.is_permanent_shift ? 'oh-priority--high' : 'oh-priority--medium'}`}>
                            {request.is_permanent_shift ? 'Permanent' : 'Temporary'}
                          </span>
                          <span className={`oh-status ${getStatusClass(request)}`}>
                            {getStatusText(request)}
                          </span>
                        </div>
                      </div>

                      <div className="oh-shift-requests__card-body">
                        <div className="oh-shift-change">
                          <div className="oh-shift-change__from">
                            <span className="oh-shift-change__label">From:</span>
                            <div className="oh-shift-info">
                              <span className="oh-shift-info__name">{request.previous_shift_name || 'N/A'}</span>
                              <span className="oh-shift-info__time">Previous Shift</span>
                            </div>
                          </div>
                          <div className="oh-shift-change__arrow">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12,5 19,12 12,19"></polyline>
                            </svg>
                          </div>
                          <div className="oh-shift-change__to">
                            <span className="oh-shift-change__label">To:</span>
                            <div className="oh-shift-info">
                              <span className="oh-shift-info__name">{request.shift_name}</span>
                              <span className="oh-shift-info__time">Requested Shift</span>
                            </div>
                          </div>
                        </div>

                        <div className="oh-shift-requests__card-meta">
                          <div className="oh-meta-item">
                            <span className="oh-meta-item__label">Shift Date:</span>
                            <span className="oh-meta-item__value">{formatDate(request.requested_date)}</span>
                          </div>
                          <div className="oh-meta-item">
                            <span className="oh-meta-item__label">Requested:</span>
                            <span className="oh-meta-item__value">{formatDate(request.created_at)}</span>
                          </div>
                        </div>

                        <div className="oh-shift-requests__card-reason">
                          <span className="oh-shift-requests__card-reason-label">Reason:</span>
                          <p className="oh-shift-requests__card-reason-text">{request.description}</p>
                        </div>
                      </div>

                      <div className="oh-shift-requests__card-footer">
                        <div className="oh-shift-requests__card-actions">
                          <button className="oh-btn oh-btn--icon oh-btn--sm" title="View Details">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          {!request.approved && !request.canceled && (
                            <>
                              <button 
                                className="oh-btn oh-btn--icon oh-btn--sm oh-btn--success" 
                                title="Approve"
                                onClick={() => handleUpdateRequest(request.id, true)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                              </button>
                              <button 
                                className="oh-btn oh-btn--icon oh-btn--sm oh-btn--danger" 
                                title="Reject"
                                onClick={() => handleUpdateRequest(request.id, false)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </>
                          )}
                          <button 
                            className="oh-btn oh-btn--icon oh-btn--sm" 
                            title="Delete"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="oh-shift-requests__stats">
              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--pending">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12,6 12,12 16,14"></polyline>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <span className="oh-stat-card__value">{requests.filter(r => !r.approved && !r.canceled).length}</span>
                  <span className="oh-stat-card__label">Pending</span>
                </div>
              </div>
              
              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--approved">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"></polyline>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <span className="oh-stat-card__value">{requests.filter(r => r.approved).length}</span>
                  <span className="oh-stat-card__label">Approved</span>
                </div>
              </div>
              
              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--rejected">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <span className="oh-stat-card__value">{requests.filter(r => r.canceled).length}</span>
                  <span className="oh-stat-card__label">Rejected</span>
                </div>
              </div>
              
              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--total">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <span className="oh-stat-card__value">{requests.length}</span>
                  <span className="oh-stat-card__label">Total Requests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <QuickAccess />
      </div>

      {/* Create Shift Request Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="oh-create-shift-modal" onClick={(e) => e.stopPropagation()}>
            <div className="oh-modal-header">
              <h2 className="oh-modal-title">Create Shift Request</h2>
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
                    Employee <span className="oh-required">*</span>
                  </label>
                  <select
                    className="oh-form-input"
                    value={createForm.employee_id}
                    onChange={(e) => handleFormChange('employee_id', e.target.value)}
                    disabled={loadingDropdowns}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.employee_first_name} {employee.employee_last_name} (ID: {employee.id})
                      </option>
                    ))}
                  </select>
                  {loadingDropdowns && (
                    <div className="oh-loading-text">Loading employees...</div>
                  )}
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Shift <span className="oh-required">*</span>
                  </label>
                  <select
                    className="oh-form-input"
                    value={createForm.shift_id}
                    onChange={(e) => handleFormChange('shift_id', e.target.value)}
                    disabled={loadingDropdowns}
                  >
                    <option value="">Select Shift</option>
                    {shifts.map((shift) => (
                      <option key={shift.id} value={shift.id}>
                        {shift.shift}
                      </option>
                    ))}
                  </select>
                  {loadingDropdowns && (
                    <div className="oh-loading-text">Loading shifts...</div>
                  )}
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
                  <label className="oh-form-label">Requested Till</label>
                  <input
                    type="date"
                    className="oh-form-input"
                    value={createForm.requested_till}
                    onChange={(e) => handleFormChange('requested_till', e.target.value)}
                    min={createForm.requested_date || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Description</label>
                  <textarea
                    className="oh-form-textarea"
                    rows={4}
                    placeholder="Provide reason for shift request..."
                    value={createForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-checkbox-label">
                    <input
                      type="checkbox"
                      className="oh-checkbox"
                      checked={createForm.is_permanent_shift}
                      onChange={(e) => handleFormChange('is_permanent_shift', e.target.checked)}
                    />
                    <span className="oh-checkbox-text">Make this a permanent shift change</span>
                  </label>
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
                onClick={handleCreateShiftRequest}
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
              {notification.type === 'info' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
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
    </div>
  );
};

export default ShiftRequests;
