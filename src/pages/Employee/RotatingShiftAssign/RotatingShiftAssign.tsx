import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import { useSidebar } from '../../../contexts/SidebarContext';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import './RotatingShiftAssign.css';
import {
  getRotatingShiftAssigns,
  createRotatingShiftAssign,
  updateRotatingShiftAssign,
  deleteRotatingShiftAssign,
  RotatingShiftAssign as ApiRotatingShiftAssign,
  CreateRotatingShiftAssignData
} from '../../../services/rotatingShiftAssignApi';

interface RotatingShiftAssign {
  id: number;
  current_shift_name: string;
  next_shift_name: string;
  rotating_shift_name: string;
  created_at: string;
  is_active: boolean;
  start_date: string;
  next_change_date: string;
  based_on: string;
  rotate_after_day: number;
  rotate_every_weekend: string;
  rotate_every: string;
  additional_data: {
    next_shift_index: number;
  };
  created_by: number;
  modified_by: number;
  employee_id: number;
  rotating_shift_id: number;
  current_shift: number;
  next_shift: number;
  rotate: string;
}

interface CreateRotatingShiftAssignForm {
  employee_id: string;
  rotating_shift_id: string;
  start_date: string;
  based_on: string;
  rotate_after_day: string;
  rotate_every_weekend: string;
  rotate_every: string;
}

const RotatingShiftAssign: React.FC = () => {
  const [viewMode, setViewMode] = useState<'assignments' | 'patterns'>('assignments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignments, setAssignments] = useState<RotatingShiftAssign[]>([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateRotatingShiftAssignForm>({
    employee_id: '',
    rotating_shift_id: '',
    start_date: '',
    based_on: 'after',
    rotate_after_day: '7',
    rotate_every_weekend: 'monday',
    rotate_every: '1'
  });
  
  const { isCollapsed, toggleSidebar } = useSidebar();

  // API functions
  const fetchRotatingShiftAssigns = async () => {
    try {
      setLoading(true);
      const response = await getRotatingShiftAssigns();
      setAssignments(response.results);
    } catch (error) {
      console.error('Error fetching rotating shift assigns:', error);
      showNotification('error', 'Failed to load rotating shift assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async () => {
    try {
      setIsLoading(true);
      const assignmentData: CreateRotatingShiftAssignData = {
        employee_id: parseInt(createForm.employee_id),
        rotating_shift_id: parseInt(createForm.rotating_shift_id),
        start_date: createForm.start_date,
        based_on: createForm.based_on,
        rotate_after_day: parseInt(createForm.rotate_after_day),
        rotate_every_weekend: createForm.rotate_every_weekend,
        rotate_every: createForm.rotate_every
      };
      
      await createRotatingShiftAssign(assignmentData);
      await fetchRotatingShiftAssigns();
      setShowCreateModal(false);
      setCreateForm({
        employee_id: '',
        rotating_shift_id: '',
        start_date: '',
        based_on: 'after',
        rotate_after_day: '7',
        rotate_every_weekend: 'monday',
        rotate_every: '1'
      });
      showNotification('success', 'Rotating shift assignment created successfully');
    } catch (error) {
      console.error('Error creating rotating shift assignment:', error);
      showNotification('error', 'Failed to create rotating shift assignment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAssignment = async (id: number, updateData: { is_active?: boolean }) => {
    try {
      await updateRotatingShiftAssign(id, updateData);
      await fetchRotatingShiftAssigns();
      const action = updateData.is_active ? 'activated' : 'deactivated';
      showNotification('success', `Rotating shift assignment ${action} successfully`);
    } catch (error) {
      console.error('Error updating rotating shift assignment:', error);
      showNotification('error', 'Failed to update rotating shift assignment');
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    try {
      await deleteRotatingShiftAssign(id);
      await fetchRotatingShiftAssigns();
      showNotification('success', 'Rotating shift assignment deleted successfully');
    } catch (error) {
      console.error('Error deleting rotating shift assignment:', error);
      showNotification('error', 'Failed to delete rotating shift assignment');
    }
  };

  useEffect(() => {
    fetchRotatingShiftAssigns();
  }, []);

  // Helper functions
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const getStatusText = (assignment: RotatingShiftAssign): string => {
    if (!assignment.is_active) return 'inactive';
    const startDate = new Date(assignment.start_date);
    const today = new Date();
    if (startDate > today) return 'upcoming';
    return 'active';
  };

  const getStatusClass = (assignment: RotatingShiftAssign): string => {
    const status = getStatusText(assignment);
    return `oh-status--${status}`;
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
      const matchesSearch = assignment.rotating_shift_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.current_shift_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.next_shift_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.id.toString().includes(searchTerm.toLowerCase());
      
      const status = getStatusText(assignment);
      const matchesStatus = statusFilter === 'all' || status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [assignments, searchTerm, statusFilter]);

  // Handle form input changes
  const handleFormChange = (field: keyof CreateRotatingShiftAssignForm, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Statistics
  const stats = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter(a => getStatusText(a) === 'active').length;
    const upcoming = assignments.filter(a => getStatusText(a) === 'upcoming').length;
    const inactive = assignments.filter(a => getStatusText(a) === 'inactive').length;
    
    return { total, active, upcoming, inactive };
  }, [assignments]);

  const getStatusBadge = (assignment: RotatingShiftAssign) => {
    const status = getStatusText(assignment);
    const statusClasses = {
      active: 'oh-status-badge oh-status-badge--active',
      upcoming: 'oh-status-badge oh-status-badge--upcoming',
      inactive: 'oh-status-badge oh-status-badge--completed'
    };
    
    return (
      <span className={statusClasses[status as keyof typeof statusClasses]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
                <h1 className="oh-page-title">Rotating Shift Assign</h1>
                <p className="oh-page-subtitle">Manage rotating shift assignments and patterns</p>
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
                  Assign Rotating Shift
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="oh-tabs">
              <button 
                className={`oh-tab ${viewMode === 'assignments' ? 'oh-tab--active' : ''}`}
                onClick={() => setViewMode('assignments')}
              >
                Assignments ({stats.total})
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
                  <div className="oh-stat-card__value">{stats.total}</div>
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
                  <div className="oh-stat-card__value">{stats.active}</div>
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
                  <div className="oh-stat-card__value">{stats.upcoming}</div>
                  <div className="oh-stat-card__label">Upcoming</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--inactive">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{stats.inactive}</div>
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
                    placeholder={viewMode === 'assignments' ? "Search assignments..." : "Search patterns..."}
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
              </div>
            </div>

            {/* Content Area */}
            <div className="oh-content-area">
              {loading ? (
                <div className="oh-loading-state">
                  <div className="oh-spinner"></div>
                  <p>Loading rotating shift assignments...</p>
                </div>
              ) : (
                <div className="oh-table-container">
                  <table className="oh-table">
                    <thead>
                      <tr>
                        <th>Assignment ID</th>
                        <th>Employee</th>
                        <th>Current Shift</th>
                        <th>Next Shift</th>
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
                            <div className="oh-table-cell">
                              <span className="oh-table-id">#{assignment.id}</span>
                            </div>
                          </td>
                          <td>
                            <div className="oh-table-cell">
                              <div className="oh-employee-info">
                                <div className="oh-employee-details">
                                  <div className="oh-employee-name">{assignment.rotating_shift_name}</div>
                                  <div className="oh-employee-meta">ID: {assignment.employee_id}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="oh-table-cell">
                              <div className="oh-shift-info">
                                <div className="oh-shift-name">{assignment.current_shift_name}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="oh-table-cell">
                              <div className="oh-shift-info">
                                <div className="oh-shift-name">{assignment.next_shift_name}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="oh-table-cell">
                              <span className="oh-rotation-info">{assignment.rotate}</span>
                            </div>
                          </td>
                          <td>
                            <div className="oh-table-cell">
                              <span className="oh-date">{formatDate(assignment.start_date)}</span>
                            </div>
                          </td>
                          <td>
                            <div className="oh-table-cell">
                              <span className="oh-date">{formatDate(assignment.next_change_date)}</span>
                            </div>
                          </td>
                          <td>
                            <div className="oh-table-cell">
                              {getStatusBadge(assignment)}
                            </div>
                          </td>
                          <td>
                            <div className="oh-table-cell">
                              <div className="oh-table-actions">
                                {assignment.is_active ? (
                                  <button 
                                    className="oh-btn oh-btn--sm oh-btn--warning"
                                    onClick={() => handleUpdateAssignment(assignment.id, { is_active: false })}
                                    title="Deactivate"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <line x1="15" y1="9" x2="9" y2="15"></line>
                                      <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                  </button>
                                ) : (
                                  <button 
                                    className="oh-btn oh-btn--sm oh-btn--success"
                                    onClick={() => handleUpdateAssignment(assignment.id, { is_active: true })}
                                    title="Activate"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="20,6 9,17 4,12"></polyline>
                                    </svg>
                                  </button>
                                )}
                                <button 
                                  className="oh-btn oh-btn--sm oh-btn--danger"
                                  onClick={() => handleDeleteAssignment(assignment.id)}
                                  title="Delete"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19,6v14a2,2 0,0,1-2,2H7a2,2 0,0,1-2-2V6m3,0V4a2,2 0,0,1,2-2h4a2,2 0,0,1,2,2v2"></path>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && filteredAssignments.length === 0 && (
                <div className="oh-empty-state">
                  <div className="oh-empty-state__icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <h3 className="oh-empty-state__title">No assignments found</h3>
                  <p className="oh-empty-state__description">
                    No rotating shift assignments match your current filters. Try adjusting your search or filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Rotating Shift Assignment Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="oh-create-rotating-modal" onClick={(e) => e.stopPropagation()}>
            <div className="oh-modal-header">
              <h2 className="oh-modal-title">Assign Rotating Shift</h2>
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
                    placeholder="Enter employee ID"
                    value={createForm.employee_id}
                    onChange={(e) => handleFormChange('employee_id', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Rotating Shift ID <span className="oh-required">*</span>
                  </label>
                  <input
                    type="number"
                    className="oh-form-input"
                    placeholder="Enter rotating shift ID"
                    value={createForm.rotating_shift_id}
                    onChange={(e) => handleFormChange('rotating_shift_id', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Start Date <span className="oh-required">*</span>
                  </label>
                  <input
                    type="date"
                    className="oh-form-input"
                    value={createForm.start_date}
                    onChange={(e) => handleFormChange('start_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Based On <span className="oh-required">*</span>
                  </label>
                  <select
                    className="oh-form-input"
                    value={createForm.based_on}
                    onChange={(e) => handleFormChange('based_on', e.target.value)}
                  >
                    <option value="after">After</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Rotate After Days <span className="oh-required">*</span>
                  </label>
                  <input
                    type="number"
                    className="oh-form-input"
                    placeholder="Enter number of days"
                    value={createForm.rotate_after_day}
                    onChange={(e) => handleFormChange('rotate_after_day', e.target.value)}
                    min="1"
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Rotate Every Weekend <span className="oh-required">*</span>
                  </label>
                  <select
                    className="oh-form-input"
                    value={createForm.rotate_every_weekend}
                    onChange={(e) => handleFormChange('rotate_every_weekend', e.target.value)}
                  >
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Rotate Every <span className="oh-required">*</span>
                  </label>
                  <input
                    type="text"
                    className="oh-form-input"
                    placeholder="Enter rotation frequency"
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
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="oh-btn oh-btn--primary"
                onClick={handleCreateAssignment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="oh-spinner"></div>
                    Assigning...
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
              onClick={() => setNotification(null)}
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

export default RotatingShiftAssign;
