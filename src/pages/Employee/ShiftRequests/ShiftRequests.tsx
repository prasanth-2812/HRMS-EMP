import React, { useState, useMemo, useEffect } from 'react';
import './ShiftRequests.css';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../../contexts/SidebarContext';

interface ShiftRequest {
  id: number;
  employee: {
    id: number;
    name: string;
    badge: string;
    profile_image?: string;
  };
  fromShift: {
    name: string;
    startTime: string;
    endTime: string;
  };
  toShift: {
    name: string;
    startTime: string;
    endTime: string;
  };
  requestDate: string;
  shiftDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: string;
  approvedBy?: string;
  rejectedBy?: string;
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateShiftRequestForm {
  employee: string;
  requestingShift: string;
  requestedDate: string;
  requestedTill: string;
  description: string;
  permanentRequest: boolean;
}

// Mock data
const mockShiftRequests: ShiftRequest[] = [
  {
    id: 1,
    employee: {
      id: 1,
      name: 'John Doe',
      badge: 'EMP001',
      profile_image: 'https://via.placeholder.com/32'
    },
    fromShift: {
      name: 'Morning Shift',
      startTime: '09:00',
      endTime: '17:00'
    },
    toShift: {
      name: 'Evening Shift',
      startTime: '14:00',
      endTime: '22:00'
    },
    requestDate: '2024-01-15',
    shiftDate: '2024-01-20',
    reason: 'Personal appointment in the morning',
    status: 'pending',
    priority: 'medium',
    requestedBy: 'john.doe@company.com',
    comments: 'Need to attend a medical appointment',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    employee: {
      id: 2,
      name: 'Jane Smith',
      badge: 'EMP002',
      profile_image: 'https://via.placeholder.com/32'
    },
    fromShift: {
      name: 'Night Shift',
      startTime: '22:00',
      endTime: '06:00'
    },
    toShift: {
      name: 'Morning Shift',
      startTime: '09:00',
      endTime: '17:00'
    },
    requestDate: '2024-01-16',
    shiftDate: '2024-01-25',
    reason: 'Family event',
    status: 'approved',
    priority: 'low',
    requestedBy: 'jane.smith@company.com',
    approvedBy: 'manager@company.com',
    comments: 'Approved for family emergency',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    id: 3,
    employee: {
      id: 3,
      name: 'Mike Johnson',
      badge: 'EMP003',
      profile_image: 'https://via.placeholder.com/32'
    },
    fromShift: {
      name: 'Evening Shift',
      startTime: '14:00',
      endTime: '22:00'
    },
    toShift: {
      name: 'Night Shift',
      startTime: '22:00',
      endTime: '06:00'
    },
    requestDate: '2024-01-18',
    shiftDate: '2024-01-22',
    reason: 'Coverage needed for colleague',
    status: 'rejected',
    priority: 'high',
    requestedBy: 'mike.johnson@company.com',
    rejectedBy: 'hr@company.com',
    comments: 'Insufficient coverage for original shift',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-19T11:30:00Z'
  },
  {
    id: 4,
    employee: {
      id: 4,
      name: 'Sarah Wilson',
      badge: 'EMP004',
      profile_image: 'https://via.placeholder.com/32'
    },
    fromShift: {
      name: 'Morning Shift',
      startTime: '09:00',
      endTime: '17:00'
    },
    toShift: {
      name: 'Night Shift',
      startTime: '22:00',
      endTime: '06:00'
    },
    requestDate: '2024-01-20',
    shiftDate: '2024-01-28',
    reason: 'Temporary schedule change request',
    status: 'pending',
    priority: 'urgent',
    requestedBy: 'sarah.wilson@company.com',
    comments: 'Urgent personal matter requires schedule adjustment',
    createdAt: '2024-01-20T08:15:00Z',
    updatedAt: '2024-01-20T08:15:00Z'
  }
];

const ShiftRequests: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortField, setSortField] = useState<keyof ShiftRequest>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<ShiftRequest[]>(mockShiftRequests);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateShiftRequestForm>({
    employee: '',
    requestingShift: '',
    requestedDate: '',
    requestedTill: '',
    description: '',
    permanentRequest: false
  });

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employee.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.fromShift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.toShift.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved': return 'oh-status--approved';
      case 'rejected': return 'oh-status--rejected';
      case 'pending': return 'oh-status--pending';
      default: return '';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'oh-priority--urgent';
      case 'high': return 'oh-priority--high';
      case 'medium': return 'oh-priority--medium';
      case 'low': return 'oh-priority--low';
      default: return '';
    }
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

  // Generate next request ID
  const generateNextRequestId = (): string => {
    const maxId = requests.reduce((max, request) => {
      const idNum = parseInt(request.id.toString());
      return idNum > max ? idNum : max;
    }, 0);
    return (maxId + 1).toString();
  };

  // Handle form submission
  const handleCreateShiftRequest = async () => {
    if (!createForm.employee || !createForm.requestingShift || !createForm.requestedDate) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create new shift request
      const newRequest: ShiftRequest = {
        id: parseInt(generateNextRequestId()),
        employee: {
          id: Math.floor(Math.random() * 1000),
          name: createForm.employee,
          badge: `EMP${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        },
        fromShift: {
          name: 'Day Shift',
          startTime: '09:00',
          endTime: '17:00'
        },
        toShift: {
          name: createForm.requestingShift,
          startTime: createForm.requestingShift === 'Day Shift' ? '09:00' : 
                     createForm.requestingShift === 'Evening Shift' ? '14:00' :
                     createForm.requestingShift === 'Night Shift' ? '22:00' : '06:00',
          endTime: createForm.requestingShift === 'Day Shift' ? '17:00' : 
                   createForm.requestingShift === 'Evening Shift' ? '22:00' :
                   createForm.requestingShift === 'Night Shift' ? '06:00' : '14:00'
        },
        requestDate: createForm.requestedDate,
        shiftDate: createForm.requestedDate,
        reason: createForm.description || 'No reason provided',
        status: 'pending',
        priority: 'medium',
        requestedBy: `${createForm.employee.toLowerCase().replace(' ', '.')}@company.com`,
        comments: createForm.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to requests
      setRequests(prev => [newRequest, ...prev]);
      
      // Reset form
      setCreateForm({
        employee: '',
        requestingShift: '',
        requestedDate: '',
        requestedTill: '',
        description: '',
        permanentRequest: false
      });
      
      setShowCreateModal(false);
      setNotification({
        type: 'success',
        message: 'Shift request created successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to create shift request. Please try again.'
      });
    } finally {
      setIsLoading(false);
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

                <select 
                  value={priorityFilter} 
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="oh-select"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
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
                        <th className="oh-table__header">Priority</th>
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
                              <img 
                                src={request.employee.profile_image} 
                                alt={request.employee.name}
                                className="oh-employee-info__avatar"
                              />
                              <div className="oh-employee-info__details">
                                <span className="oh-employee-info__name">{request.employee.name}</span>
                                <span className="oh-employee-info__badge">{request.employee.badge}</span>
                              </div>
                            </div>
                          </td>
                          <td className="oh-table__cell">
                            <div className="oh-shift-info">
                              <span className="oh-shift-info__name">{request.fromShift.name}</span>
                              <span className="oh-shift-info__time">
                                {formatTime(request.fromShift.startTime)} - {formatTime(request.fromShift.endTime)}
                              </span>
                            </div>
                          </td>
                          <td className="oh-table__cell">
                            <div className="oh-shift-info">
                              <span className="oh-shift-info__name">{request.toShift.name}</span>
                              <span className="oh-shift-info__time">
                                {formatTime(request.toShift.startTime)} - {formatTime(request.toShift.endTime)}
                              </span>
                            </div>
                          </td>
                          <td className="oh-table__cell">
                            <span className="oh-date">{formatDate(request.shiftDate)}</span>
                          </td>
                          <td className="oh-table__cell">
                            <span className={`oh-priority ${getPriorityClass(request.priority)}`}>
                              {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                            </span>
                          </td>
                          <td className="oh-table__cell">
                            <span className={`oh-status ${getStatusClass(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="oh-table__cell">
                            <span className="oh-reason" title={request.reason}>
                              {request.reason.length > 30 ? `${request.reason.substring(0, 30)}...` : request.reason}
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
                              {request.status === 'pending' && (
                                <>
                                  <button className="oh-btn oh-btn--icon oh-btn--sm oh-btn--success" title="Approve">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="20,6 9,17 4,12"></polyline>
                                    </svg>
                                  </button>
                                  <button className="oh-btn oh-btn--icon oh-btn--sm oh-btn--danger" title="Reject">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </button>
                                </>
                              )}
                              <button className="oh-btn oh-btn--icon oh-btn--sm" title="Edit">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
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
                          <img 
                            src={request.employee.profile_image} 
                            alt={request.employee.name}
                            className="oh-employee-info__avatar"
                          />
                          <div className="oh-employee-info__details">
                            <span className="oh-employee-info__name">{request.employee.name}</span>
                            <span className="oh-employee-info__badge">{request.employee.badge}</span>
                          </div>
                        </div>
                        <div className="oh-shift-requests__card-badges">
                          <span className={`oh-priority ${getPriorityClass(request.priority)}`}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </span>
                          <span className={`oh-status ${getStatusClass(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="oh-shift-requests__card-body">
                        <div className="oh-shift-change">
                          <div className="oh-shift-change__from">
                            <span className="oh-shift-change__label">From:</span>
                            <div className="oh-shift-info">
                              <span className="oh-shift-info__name">{request.fromShift.name}</span>
                              <span className="oh-shift-info__time">
                                {formatTime(request.fromShift.startTime)} - {formatTime(request.fromShift.endTime)}
                              </span>
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
                              <span className="oh-shift-info__name">{request.toShift.name}</span>
                              <span className="oh-shift-info__time">
                                {formatTime(request.toShift.startTime)} - {formatTime(request.toShift.endTime)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="oh-shift-requests__card-meta">
                          <div className="oh-meta-item">
                            <span className="oh-meta-item__label">Shift Date:</span>
                            <span className="oh-meta-item__value">{formatDate(request.shiftDate)}</span>
                          </div>
                          <div className="oh-meta-item">
                            <span className="oh-meta-item__label">Requested:</span>
                            <span className="oh-meta-item__value">{formatDate(request.createdAt)}</span>
                          </div>
                        </div>

                        <div className="oh-shift-requests__card-reason">
                          <span className="oh-shift-requests__card-reason-label">Reason:</span>
                          <p className="oh-shift-requests__card-reason-text">{request.reason}</p>
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
                          {request.status === 'pending' && (
                            <>
                              <button className="oh-btn oh-btn--icon oh-btn--sm oh-btn--success" title="Approve">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="20,6 9,17 4,12"></polyline>
                                </svg>
                              </button>
                              <button className="oh-btn oh-btn--icon oh-btn--sm oh-btn--danger" title="Reject">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </>
                          )}
                          <button className="oh-btn oh-btn--icon oh-btn--sm" title="Edit">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
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
                  <span className="oh-stat-card__value">{requests.filter(r => r.status === 'pending').length}</span>
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
                  <span className="oh-stat-card__value">{requests.filter(r => r.status === 'approved').length}</span>
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
                  <span className="oh-stat-card__value">{requests.filter(r => r.status === 'rejected').length}</span>
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
                    value={createForm.employee}
                    onChange={(e) => handleFormChange('employee', e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Mike Johnson">Mike Johnson</option>
                    <option value="Sarah Wilson">Sarah Wilson</option>
                    <option value="David Brown">David Brown</option>
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Requesting Shift <span className="oh-required">*</span>
                  </label>
                  <select
                    className="oh-form-input"
                    value={createForm.requestingShift}
                    onChange={(e) => handleFormChange('requestingShift', e.target.value)}
                  >
                    <option value="">Select Shift</option>
                    <option value="Day Shift">Day Shift (09:00 - 17:00)</option>
                    <option value="Evening Shift">Evening Shift (14:00 - 22:00)</option>
                    <option value="Night Shift">Night Shift (22:00 - 06:00)</option>
                    <option value="Morning Shift">Morning Shift (06:00 - 14:00)</option>
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Requested Date <span className="oh-required">*</span>
                  </label>
                  <input
                    type="date"
                    className="oh-form-input"
                    value={createForm.requestedDate}
                    onChange={(e) => handleFormChange('requestedDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Requested Till</label>
                  <input
                    type="date"
                    className="oh-form-input"
                    value={createForm.requestedTill}
                    onChange={(e) => handleFormChange('requestedTill', e.target.value)}
                    min={createForm.requestedDate || new Date().toISOString().split('T')[0]}
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
                      checked={createForm.permanentRequest}
                      onChange={(e) => handleFormChange('permanentRequest', e.target.checked)}
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
