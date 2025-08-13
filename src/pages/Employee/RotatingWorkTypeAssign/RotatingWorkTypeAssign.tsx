import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import { useSidebar } from '../../../contexts/SidebarContext';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import {
  getRotatingWorkTypeAssigns,
  createRotatingWorkTypeAssign,
  updateRotatingWorkTypeAssign,
  deleteRotatingWorkTypeAssign,
  RotatingWorkTypeAssign as ApiRotatingWorkTypeAssign,
  CreateRotatingWorkTypeAssignData
} from '../../../services/rotatingWorkTypeAssignApi';
import './RotatingWorkTypeAssign.css';

// Updated interfaces to match API response
interface RotatingWorkTypeAssign {
  id: number;
  current_work_type_name: string;
  next_work_type_name: string;
  rotating_work_type_name: string;
  created_at: string;
  is_active: boolean;
  start_date: string;
  next_change_date: string;
  based_on: string;
  rotate_after_day: number;
  rotate_every_weekend: string;
  rotate_every: string;
  additional_data: {
    next_work_type_index: number;
  };
  created_by: number;
  modified_by: number;
  employee_id: number;
  rotating_work_type_id: number;
  current_work_type: number;
  next_work_type: number;
  rotate: string;
}

interface CreateRotatingWorkTypeAssignForm {
  employee_id: string;
  rotating_work_type_id: string;
  start_date: string;
  based_on: string;
  rotate_after_day: string;
  rotate_every_weekend: string;
  rotate_every: string;
}

type NotificationType = 'success' | 'error';

const RotatingWorkTypeAssign: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<RotatingWorkTypeAssign[]>([]);
  const [notification, setNotification] = useState<{ type: NotificationType; message: string } | null>(null);
  const [createForm, setCreateForm] = useState<CreateRotatingWorkTypeAssignForm>({
    employee_id: '',
    rotating_work_type_id: '',
    start_date: '',
    based_on: 'after',
    rotate_after_day: '7',
    rotate_every_weekend: 'monday',
    rotate_every: '1'
  });
  const { isCollapsed, toggleSidebar } = useSidebar();

  // API functions
  const fetchRotatingWorkTypeAssigns = async () => {
    try {
      setLoading(true);
      const response = await getRotatingWorkTypeAssigns();
      setAssignments(response.results);
    } catch (error) {
      console.error('Error fetching rotating work type assigns:', error);
      showNotification('error', 'Failed to load rotating work type assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if (!createForm.employee_id || !createForm.rotating_work_type_id || !createForm.start_date) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const data: CreateRotatingWorkTypeAssignData = {
        employee_id: parseInt(createForm.employee_id),
        rotating_work_type_id: parseInt(createForm.rotating_work_type_id),
        start_date: createForm.start_date,
        based_on: createForm.based_on,
        rotate_after_day: parseInt(createForm.rotate_after_day),
        rotate_every_weekend: createForm.rotate_every_weekend,
        rotate_every: createForm.rotate_every
      };
      
      await createRotatingWorkTypeAssign(data);
      showNotification('success', 'Rotating work type assignment created successfully');
      setCreateForm({
        employee_id: '',
        rotating_work_type_id: '',
        start_date: '',
        based_on: 'after',
        rotate_after_day: '7',
        rotate_every_weekend: 'monday',
        rotate_every: '1'
      });
      setShowCreateModal(false);
      fetchRotatingWorkTypeAssigns();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = async (id: number, data: { is_active: boolean }) => {
    try {
      await updateRotatingWorkTypeAssign(id, data);
      showNotification('success', `Assignment ${data.is_active ? 'activated' : 'deactivated'} successfully`);
      fetchRotatingWorkTypeAssigns();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to update assignment');
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }

    try {
      await deleteRotatingWorkTypeAssign(id);
      showNotification('success', 'Assignment deleted successfully');
      fetchRotatingWorkTypeAssigns();
    } catch (error: any) {
      showNotification('error', error.message || 'Failed to delete assignment');
    }
  };

  useEffect(() => {
    fetchRotatingWorkTypeAssigns();
  }, []);

  // Helper functions
  const showNotification = (type: NotificationType, message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const getStatusText = (assignment: RotatingWorkTypeAssign): string => {
    if (!assignment.is_active) return 'Inactive';
    
    const today = new Date();
    const startDate = new Date(assignment.start_date);
    const nextChangeDate = new Date(assignment.next_change_date);
    
    if (startDate > today) return 'Upcoming';
    if (nextChangeDate < today) return 'Expired';
    return 'Active';
  };

  const getStatusClass = (assignment: RotatingWorkTypeAssign): string => {
    const status = getStatusText(assignment);
    switch (status) {
      case 'Active': return 'oh-status-badge--active';
      case 'Upcoming': return 'oh-status-badge--upcoming';
      case 'Inactive': return 'oh-status-badge--inactive';
      case 'Expired': return 'oh-status-badge--expired';
      default: return 'oh-status-badge--inactive';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter and search logic for assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesSearch = assignment.rotating_work_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.current_work_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.next_work_type_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.id.toString().includes(searchTerm.toLowerCase());
      
      const status = getStatusText(assignment);
      const matchesStatus = statusFilter === 'all' || status.toLowerCase() === statusFilter.toLowerCase();
      
      const matchesType = typeFilter === 'all' || assignment.based_on === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [assignments, searchTerm, statusFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalAssignments = assignments.length;
    const activeAssignments = assignments.filter(a => getStatusText(a) === 'Active').length;
    const upcomingAssignments = assignments.filter(a => getStatusText(a) === 'Upcoming').length;
    const inactiveAssignments = assignments.filter(a => getStatusText(a) === 'Inactive').length;
    
    return { totalAssignments, activeAssignments, upcomingAssignments, inactiveAssignments };
  }, [assignments]);

  const getStatusBadge = (assignment: RotatingWorkTypeAssign) => {
    const status = getStatusText(assignment);
    const statusClass = getStatusClass(assignment);
    
    return (
      <span className={`oh-status-badge ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Form handling functions
  const handleFormChange = (field: keyof CreateRotatingWorkTypeAssignForm, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
                <h1 className="oh-page-title">Rotating Work Type Assign</h1>
                <p className="oh-page-subtitle">Manage rotating work type assignments and patterns</p>
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
                  Assign Rotating Work Type
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="oh-tabs">
              <button 
                className="oh-tab oh-tab--active"
              >
                Assignments ({stats.totalAssignments})
              </button>
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
                  <div className="oh-stat-card__value">{stats.totalAssignments}</div>
                  <div className="oh-stat-card__label">Total Assignments</div>
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
                  <div className="oh-stat-card__value">{stats.activeAssignments}</div>
                  <div className="oh-stat-card__label">Active</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--upcoming">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 2v4"></path>
                    <path d="M16 2v4"></path>
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M3 10h18"></path>
                    <path d="M8 14h.01"></path>
                    <path d="M12 14h.01"></path>
                    <path d="M16 14h.01"></path>
                    <path d="M8 18h.01"></path>
                    <path d="M12 18h.01"></path>
                    <path d="M16 18h.01"></path>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.upcomingAssignments}</div>
                  <div className="oh-stat-card__label">Upcoming</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--inactive">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.inactiveAssignments}</div>
                  <div className="oh-stat-card__label">Inactive</div>
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
                    placeholder="Search assignments..."
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
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="inactive">Inactive</option>
                </select>

                <select 
                  className="oh-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="after">After Days</option>
                  <option value="weekend">Weekend</option>
                </select>
              </div>
            </div>

            {/* Content Area */}
            <div className="oh-content-area">
              <div className="oh-table-container">
                {loading ? (
                  <div className="oh-loading-state">
                    <div className="oh-spinner"></div>
                    <p>Loading assignments...</p>
                  </div>
                ) : filteredAssignments.length === 0 ? (
                  <div className="oh-empty-state">
                    <div className="oh-empty-state__icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </div>
                    <h3 className="oh-empty-state__title">No assignments found</h3>
                    <p className="oh-empty-state__message">No employees assigned to rotating work types.</p>
                  </div>
                ) : (
                  <table className="oh-table">
                    <thead>
                      <tr>
                        <th>Assignment ID</th>
                        <th>Employee</th>
                        <th>Current Work Type</th>
                        <th>Next Work Type</th>
                        <th>Rotation</th>
                        <th>Start Date</th>
                        <th>Next Change</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td>
                            <span className="oh-assignment-id">{assignment.id}</span>
                          </td>
                          <td>
                            <div className="oh-employee-info">
                              <div className="oh-employee-name">Employee {assignment.employee_id}</div>
                            </div>
                          </td>
                          <td>
                            <span className="oh-work-type-badge">
                              {assignment.current_work_type_name}
                            </span>
                          </td>
                          <td>
                            <span className="oh-work-type-badge">
                              {assignment.next_work_type_name}
                            </span>
                          </td>
                          <td>{assignment.rotating_work_type_name}</td>
                          <td>{formatDate(assignment.start_date)}</td>
                          <td>{assignment.next_change_date ? formatDate(assignment.next_change_date) : 'N/A'}</td>
                          <td>{getStatusBadge(assignment)}</td>
                          <td>
                            <div className="oh-actions">
                              {assignment.is_active ? (
                                <button 
                                  className="oh-btn oh-btn--sm oh-btn--warning"
                                  onClick={() => handleUpdateAssignment(assignment.id, { is_active: false })}
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button 
                                  className="oh-btn oh-btn--sm oh-btn--success"
                                  onClick={() => handleUpdateAssignment(assignment.id, { is_active: true })}
                                >
                                  Activate
                                </button>
                              )}
                              <button 
                                className="oh-btn oh-btn--sm oh-btn--danger"
                                onClick={() => handleDeleteAssignment(assignment.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay">
          <div className="oh-create-rotating-modal">
            <div className="oh-modal-header">
              <h2 className="oh-modal-title">Assign Rotating Work Type</h2>
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
                <div className="oh-form-group">
                  <label className="oh-form-label">Employee <span className="oh-required">*</span></label>
                  <input 
                    type="number"
                    className="oh-form-input"
                    placeholder="Enter employee ID"
                    value={createForm.employee_id}
                    onChange={(e) => handleFormChange('employee_id', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Rotating Work Type ID <span className="oh-required">*</span></label>
                  <input 
                    type="number"
                    className="oh-form-input"
                    placeholder="Enter rotating work type ID"
                    value={createForm.rotating_work_type_id}
                    onChange={(e) => handleFormChange('rotating_work_type_id', e.target.value)}
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
                
                <div className="oh-form-group">
                  <label className="oh-form-label">Based On</label>
                  <select 
                    className="oh-form-input"
                    value={createForm.based_on}
                    onChange={(e) => handleFormChange('based_on', e.target.value)}
                  >
                    <option value="after">After Days</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Rotate After Days</label>
                  <input 
                    type="number"
                    className="oh-form-input"
                    value={createForm.rotate_after_day}
                    onChange={(e) => handleFormChange('rotate_after_day', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Rotate Every Weekend</label>
                  <select 
                    className="oh-form-input"
                    value={createForm.rotate_every_weekend}
                    onChange={(e) => handleFormChange('rotate_every_weekend', e.target.value)}
                  >
                    <option value="monday">Monday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Rotate Every</label>
                  <input 
                    type="text"
                    className="oh-form-input"
                    value={createForm.rotate_every}
                    onChange={(e) => handleFormChange('rotate_every', e.target.value)}
                  />
                </div>
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
                onClick={handleCreateAssignment}
                disabled={loading || !createForm.employee_id || !createForm.rotating_work_type_id || !createForm.start_date}
              >
                {loading ? (
                  <>
                    <div className="oh-spinner"></div>
                    Creating...
                  </>
                ) : (
                  'Create Assignment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`oh-notification oh-notification--${notification.type}`}>
          <div className="oh-notification__content">
            <div className="oh-notification__icon">
              {notification.type === 'success' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,11 12,14 22,4"></polyline>
                  <path d="m21,4 0,7 -5,0"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
            </div>
            <div className="oh-notification__message">{notification.message}</div>
          </div>
          <button 
            className="oh-notification__close"
            onClick={closeNotification}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      <QuickAccess />
    </div>
  );
};

export default RotatingWorkTypeAssign;
