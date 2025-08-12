import React, { useState, useMemo } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import { useSidebar } from '../../../contexts/SidebarContext';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import './RotatingShiftAssign.css';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  department: string;
  position: string;
  currentShift?: string;
}

interface ShiftPattern {
  id: string;
  name: string;
  description: string;
  shifts: Array<{
    name: string;
    startTime: string;
    endTime: string;
    days: string[];
  }>;
  rotationPeriod: number; // in days
  isActive: boolean;
}

interface Assignment {
  id: string;
  employee: Employee;
  shiftPattern: ShiftPattern;
  startDate: string;
  endDate?: string;
  currentWeek: number;
  status: 'active' | 'upcoming' | 'completed';
  assignedBy: string;
  assignedDate: string;
}

interface CreateRotatingShiftAssignForm {
  employee: string;
  shiftPattern: string;
  startDate: string;
  endDate: string;
  notes: string;
}

const RotatingShiftAssign: React.FC = () => {
  const [viewMode, setViewMode] = useState<'assignments' | 'patterns'>('assignments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateRotatingShiftAssignForm>({
    employee: '',
    shiftPattern: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Mock data for shift patterns
  const mockShiftPatterns: ShiftPattern[] = [
    {
      id: 'SP-001',
      name: '3-Shift Rotation',
      description: 'Morning, Evening, Night rotation every week',
      shifts: [
        { name: 'Morning', startTime: '06:00', endTime: '14:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
        { name: 'Evening', startTime: '14:00', endTime: '22:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
        { name: 'Night', startTime: '22:00', endTime: '06:00', days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }
      ],
      rotationPeriod: 7,
      isActive: true
    },
    {
      id: 'SP-002',
      name: '2-Shift Weekend',
      description: 'Day and night shifts for weekend coverage',
      shifts: [
        { name: 'Day', startTime: '08:00', endTime: '20:00', days: ['Saturday', 'Sunday'] },
        { name: 'Night', startTime: '20:00', endTime: '08:00', days: ['Saturday', 'Sunday'] }
      ],
      rotationPeriod: 14,
      isActive: true
    }
  ];

  // Mock data for assignments
  const mockAssignments: Assignment[] = [
    {
      id: 'RSA-001',
      employee: {
        id: 'EMP-001',
        name: 'John Smith',
        avatar: '/avatars/john-smith.jpg',
        badgeId: 'HOH-001',
        department: 'Manufacturing',
        position: 'Production Worker',
        currentShift: 'Morning'
      },
      shiftPattern: mockShiftPatterns[0],
      startDate: '2024-01-15',
      currentWeek: 2,
      status: 'active',
      assignedBy: 'Manager Name',
      assignedDate: '2024-01-10'
    },
    {
      id: 'RSA-002',
      employee: {
        id: 'EMP-002',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah-johnson.jpg',
        badgeId: 'HOH-002',
        department: 'Security',
        position: 'Security Guard',
        currentShift: 'Night'
      },
      shiftPattern: mockShiftPatterns[1],
      startDate: '2024-01-22',
      currentWeek: 1,
      status: 'upcoming',
      assignedBy: 'Manager Name',
      assignedDate: '2024-01-18'
    },
    {
      id: 'RSA-003',
      employee: {
        id: 'EMP-003',
        name: 'Mike Chen',
        avatar: '/avatars/mike-chen.jpg',
        badgeId: 'HOH-003',
        department: 'Manufacturing',
        position: 'Quality Inspector',
        currentShift: 'Evening'
      },
      shiftPattern: mockShiftPatterns[0],
      startDate: '2023-12-01',
      endDate: '2024-01-20',
      currentWeek: 3,
      status: 'completed',
      assignedBy: 'Manager Name',
      assignedDate: '2023-11-25'
    }
  ];

  // Filter and search logic for assignments
  React.useEffect(() => {
    setAssignments(mockAssignments);
  }, []);

  // Generate next assignment ID
  const generateNextAssignmentId = (): string => {
    const maxId = assignments.reduce((max, assignment) => {
      const idNum = parseInt(assignment.id.replace('RSA-', ''));
      return idNum > max ? idNum : max;
    }, 0);
    return `RSA-${(maxId + 1).toString().padStart(3, '0')}`;
  };

  // Handle form submission
  const handleCreateAssignment = async () => {
    if (!createForm.employee || !createForm.shiftPattern || !createForm.startDate) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create new assignment
      const newAssignment: Assignment = {
        id: generateNextAssignmentId(),
        employee: {
          id: `EMP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          name: createForm.employee,
          avatar: '/avatars/default.jpg',
          badgeId: `HOH-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          department: 'Operations',
          position: 'Employee',
          currentShift: 'Day'
        },
        shiftPattern: mockShiftPatterns.find(p => p.name === createForm.shiftPattern) || mockShiftPatterns[0],
        startDate: createForm.startDate,
        endDate: createForm.endDate || undefined,
        currentWeek: 1,
        status: new Date(createForm.startDate) > new Date() ? 'upcoming' : 'active',
        assignedBy: 'Manager Name',
        assignedDate: new Date().toISOString().split('T')[0]
      };

      // Add to assignments
      setAssignments(prev => [newAssignment, ...prev]);
      
      // Reset form
      setCreateForm({
        employee: '',
        shiftPattern: '',
        startDate: '',
        endDate: '',
        notes: ''
      });
      
      setShowCreateModal(false);
      setNotification({
        type: 'success',
        message: 'Rotating shift assignment created successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to create assignment. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleFormChange = (field: keyof CreateRotatingShiftAssignForm, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Close notification
  const closeNotification = () => {
    setNotification(null);
  };
  const filteredAssignments = useMemo(() => {
    return mockAssignments.filter(assignment => {
      const matchesSearch = assignment.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.shiftPattern.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || assignment.employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [mockAssignments, searchTerm, statusFilter, departmentFilter]);

  // Filter shift patterns
  const filteredPatterns = useMemo(() => {
    return mockShiftPatterns.filter(pattern => {
      return pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pattern.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [mockShiftPatterns, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totalAssignments = mockAssignments.length;
    const activeAssignments = mockAssignments.filter(a => a.status === 'active').length;
    const upcomingAssignments = mockAssignments.filter(a => a.status === 'upcoming').length;
    const totalPatterns = mockShiftPatterns.length;
    const activePatterns = mockShiftPatterns.filter(p => p.isActive).length;
    
    return { totalAssignments, activeAssignments, upcomingAssignments, totalPatterns, activePatterns };
  }, [mockAssignments, mockShiftPatterns]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'oh-status-badge oh-status-badge--active',
      upcoming: 'oh-status-badge oh-status-badge--upcoming',
      completed: 'oh-status-badge oh-status-badge--completed'
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

  const getCurrentShiftInfo = (assignment: Assignment) => {
    const currentShift = assignment.shiftPattern.shifts[assignment.currentWeek % assignment.shiftPattern.shifts.length];
    return currentShift;
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
                Assignments ({stats.totalAssignments})
              </button>
              <button 
                className={`oh-tab ${viewMode === 'patterns' ? 'oh-tab--active' : ''}`}
                onClick={() => setViewMode('patterns')}
              >
                Shift Patterns ({stats.totalPatterns})
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="oh-stats-grid">
              {viewMode === 'assignments' ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="oh-stat-card">
                    <div className="oh-stat-card__icon oh-stat-card__icon--total">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                    <div className="oh-stat-card__content">
                      <div className="oh-stat-card__value">{stats.totalPatterns}</div>
                      <div className="oh-stat-card__label">Total Patterns</div>
                    </div>
                  </div>

                  <div className="oh-stat-card">
                    <div className="oh-stat-card__icon oh-stat-card__icon--active">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,11 12,14 22,4"></polyline>
                        <path d="m21,4 0,7 -5,0"></path>
                        <path d="M5.5,7 8.5,7"></path>
                        <path d="M7,16 l-1.5,0 0,-4.5"></path>
                      </svg>
                    </div>
                    <div className="oh-stat-card__content">
                      <div className="oh-stat-card__value">{stats.activePatterns}</div>
                      <div className="oh-stat-card__label">Active Patterns</div>
                    </div>
                  </div>
                </>
              )}
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
                {viewMode === 'assignments' && (
                  <>
                    <select 
                      className="oh-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                    </select>

                    <select 
                      className="oh-select"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="all">All Departments</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Security">Security</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="oh-content-area">
              {viewMode === 'assignments' ? (
                <div className="oh-table-container">
                  <table className="oh-table">
                    <thead>
                      <tr>
                        <th>Assignment ID</th>
                        <th>Employee</th>
                        <th>Shift Pattern</th>
                        <th>Current Shift</th>
                        <th>Week</th>
                        <th>Start Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((assignment) => {
                        const currentShift = getCurrentShiftInfo(assignment);
                        return (
                          <tr key={assignment.id}>
                            <td>
                              <span className="oh-assignment-id">{assignment.id}</span>
                            </td>
                            <td>
                              <div className="oh-employee-info">
                                <div className="oh-employee-avatar">
                                  {assignment.employee.name.charAt(0)}
                                </div>
                                <div className="oh-employee-details">
                                  <div className="oh-employee-name">{assignment.employee.name}</div>
                                  <div className="oh-employee-badge">{assignment.employee.badgeId}</div>
                                  <div className="oh-employee-dept">{assignment.employee.department}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="oh-pattern-info">
                                <div className="oh-pattern-name">{assignment.shiftPattern.name}</div>
                                <div className="oh-pattern-desc">{assignment.shiftPattern.description}</div>
                              </div>
                            </td>
                            <td>
                              <div className="oh-current-shift">
                                <div className="oh-shift-name">{currentShift?.name}</div>
                                <div className="oh-shift-time">
                                  {currentShift?.startTime} - {currentShift?.endTime}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="oh-week-badge">Week {assignment.currentWeek}</span>
                            </td>
                            <td>{formatDate(assignment.startDate)}</td>
                            <td>{getStatusBadge(assignment.status)}</td>
                            <td>
                              <div className="oh-actions">
                                <button className="oh-btn oh-btn--sm oh-btn--ghost">View</button>
                                {assignment.status === 'active' && (
                                  <button className="oh-btn oh-btn--sm oh-btn--secondary">Modify</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="oh-patterns-grid">
                  {filteredPatterns.map((pattern) => (
                    <div key={pattern.id} className="oh-pattern-card">
                      <div className="oh-pattern-card__header">
                        <div className="oh-pattern-card__title">
                          <h3>{pattern.name}</h3>
                          <span className={`oh-pattern-status ${pattern.isActive ? 'oh-pattern-status--active' : 'oh-pattern-status--inactive'}`}>
                            {pattern.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="oh-pattern-card__description">{pattern.description}</p>
                      </div>

                      <div className="oh-pattern-card__details">
                        <div className="oh-pattern-detail">
                          <span className="oh-pattern-detail__label">Rotation Period:</span>
                          <span className="oh-pattern-detail__value">{pattern.rotationPeriod} days</span>
                        </div>
                        <div className="oh-pattern-detail">
                          <span className="oh-pattern-detail__label">Shifts:</span>
                          <span className="oh-pattern-detail__value">{pattern.shifts.length} shifts</span>
                        </div>
                      </div>

                      <div className="oh-pattern-card__shifts">
                        {pattern.shifts.map((shift, index) => (
                          <div key={index} className="oh-shift-item">
                            <div className="oh-shift-item__name">{shift.name}</div>
                            <div className="oh-shift-item__time">{shift.startTime} - {shift.endTime}</div>
                            <div className="oh-shift-item__days">
                              {shift.days.map(day => day.substring(0, 3)).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="oh-pattern-card__actions">
                        <button className="oh-btn oh-btn--sm oh-btn--ghost">View Details</button>
                        <button className="oh-btn oh-btn--sm oh-btn--primary">Assign Employees</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {((viewMode === 'assignments' && filteredAssignments.length === 0) || 
                (viewMode === 'patterns' && filteredPatterns.length === 0)) && (
                <div className="oh-empty-state">
                  <div className="oh-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <h3 className="oh-empty-state__title">
                    {viewMode === 'assignments' ? 'No assignments found' : 'No shift patterns found'}
                  </h3>
                  <p className="oh-empty-state__message">
                    {viewMode === 'assignments' 
                      ? 'No employees assigned to rotating shifts.' 
                      : 'No shift patterns have been created yet.'}
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
                    Shift Pattern <span className="oh-required">*</span>
                  </label>
                  <select
                    className="oh-form-input"
                    value={createForm.shiftPattern}
                    onChange={(e) => handleFormChange('shiftPattern', e.target.value)}
                  >
                    <option value="">Select Shift Pattern</option>
                    <option value="3-Shift Rotation">3-Shift Rotation</option>
                    <option value="Day-Night Rotation">Day-Night Rotation</option>
                    <option value="Weekly Rotation">Weekly Rotation</option>
                    <option value="4-Day Rotation">4-Day Rotation</option>
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">
                    Start Date <span className="oh-required">*</span>
                  </label>
                  <input
                    type="date"
                    className="oh-form-input"
                    value={createForm.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">End Date</label>
                  <input
                    type="date"
                    className="oh-form-input"
                    value={createForm.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                    min={createForm.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Notes</label>
                  <textarea
                    className="oh-form-textarea"
                    rows={4}
                    placeholder="Add any additional notes about this assignment..."
                    value={createForm.notes}
                    onChange={(e) => handleFormChange('notes', e.target.value)}
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

      <QuickAccess />
    </div>
  );
};

export default RotatingShiftAssign;
