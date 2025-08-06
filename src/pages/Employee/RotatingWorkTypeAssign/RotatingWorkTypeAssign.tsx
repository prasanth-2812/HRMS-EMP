import React, { useState, useMemo } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Navbar from '../../../components/Layout/Navbar';
import { useSidebar } from '../../../contexts/SidebarContext';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import './RotatingWorkTypeAssign.css';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  department: string;
  position: string;
  currentWorkType?: string;
}

interface WorkType {
  id: string;
  name: string;
  description: string;
  isRemote: boolean;
  requirements: string[];
}

interface WorkTypePattern {
  id: string;
  name: string;
  description: string;
  workTypes: WorkType[];
  rotationPeriod: number; // in days
  isActive: boolean;
}

interface Assignment {
  id: string;
  employee: Employee;
  workTypePattern: WorkTypePattern;
  startDate: string;
  endDate?: string;
  currentCycle: number;
  status: 'active' | 'upcoming' | 'completed';
  assignedBy: string;
  assignedDate: string;
}

const RotatingWorkTypeAssign: React.FC = () => {
  const [viewMode, setViewMode] = useState<'assignments' | 'patterns'>('assignments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    employee: '',
    workTypePattern: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const { isCollapsed } = useSidebar();

  // Mock data for work types
  const mockWorkTypes: WorkType[] = [
    {
      id: 'WT-001',
      name: 'Office Work',
      description: 'Standard office-based work arrangement',
      isRemote: false,
      requirements: ['Physical presence', 'Office equipment']
    },
    {
      id: 'WT-002',
      name: 'Remote Work',
      description: 'Work from home arrangement',
      isRemote: true,
      requirements: ['Stable internet', 'Home office setup']
    },
    {
      id: 'WT-003',
      name: 'Field Work',
      description: 'Client-facing field work arrangement',
      isRemote: false,
      requirements: ['Travel capability', 'Client interaction skills']
    },
    {
      id: 'WT-004',
      name: 'Hybrid Work',
      description: 'Mix of office and remote work',
      isRemote: false,
      requirements: ['Flexibility', 'Home and office setup']
    }
  ];

  // Mock data for work type patterns
  const mockWorkTypePatterns: WorkTypePattern[] = [
    {
      id: 'WTP-001',
      name: 'Office-Remote Rotation',
      description: 'Alternating between office and remote work weekly',
      workTypes: [mockWorkTypes[0], mockWorkTypes[1]],
      rotationPeriod: 7,
      isActive: true
    },
    {
      id: 'WTP-002',
      name: 'Full Cycle Rotation',
      description: 'Complete rotation through all work types monthly',
      workTypes: mockWorkTypes,
      rotationPeriod: 30,
      isActive: true
    },
    {
      id: 'WTP-003',
      name: 'Sales Field Rotation',
      description: 'Office and field work for sales team',
      workTypes: [mockWorkTypes[0], mockWorkTypes[2]],
      rotationPeriod: 14,
      isActive: false
    }
  ];

  // Mock data for assignments
  const mockAssignments: Assignment[] = [
    {
      id: 'RWTA-001',
      employee: {
        id: 'EMP-001',
        name: 'John Smith',
        avatar: '/avatars/john-smith.jpg',
        badgeId: 'HOH-001',
        department: 'Engineering',
        position: 'Senior Developer',
        currentWorkType: 'Remote Work'
      },
      workTypePattern: mockWorkTypePatterns[0],
      startDate: '2024-01-15',
      currentCycle: 3,
      status: 'active',
      assignedBy: 'Manager Name',
      assignedDate: '2024-01-10'
    },
    {
      id: 'RWTA-002',
      employee: {
        id: 'EMP-002',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah-johnson.jpg',
        badgeId: 'HOH-002',
        department: 'Marketing',
        position: 'Marketing Manager',
        currentWorkType: 'Hybrid Work'
      },
      workTypePattern: mockWorkTypePatterns[1],
      startDate: '2024-02-01',
      currentCycle: 1,
      status: 'upcoming',
      assignedBy: 'Manager Name',
      assignedDate: '2024-01-25'
    },
    {
      id: 'RWTA-003',
      employee: {
        id: 'EMP-003',
        name: 'Mike Chen',
        avatar: '/avatars/mike-chen.jpg',
        badgeId: 'HOH-003',
        department: 'Sales',
        position: 'Sales Executive',
        currentWorkType: 'Field Work'
      },
      workTypePattern: mockWorkTypePatterns[2],
      startDate: '2023-12-01',
      endDate: '2024-01-15',
      currentCycle: 2,
      status: 'completed',
      assignedBy: 'Manager Name',
      assignedDate: '2023-11-25'
    }
  ];

  // Filter and search logic for assignments
  const filteredAssignments = useMemo(() => {
    return mockAssignments.filter(assignment => {
      const matchesSearch = assignment.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assignment.workTypePattern.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || assignment.employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [mockAssignments, searchTerm, statusFilter, departmentFilter]);

  // Filter work type patterns
  const filteredPatterns = useMemo(() => {
    return mockWorkTypePatterns.filter(pattern => {
      return pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             pattern.description.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [mockWorkTypePatterns, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totalAssignments = mockAssignments.length;
    const activeAssignments = mockAssignments.filter(a => a.status === 'active').length;
    const upcomingAssignments = mockAssignments.filter(a => a.status === 'upcoming').length;
    const totalPatterns = mockWorkTypePatterns.length;
    const activePatterns = mockWorkTypePatterns.filter(p => p.isActive).length;
    
    return { totalAssignments, activeAssignments, upcomingAssignments, totalPatterns, activePatterns };
  }, [mockAssignments, mockWorkTypePatterns]);

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

  const getCurrentWorkType = (assignment: Assignment) => {
    const currentWorkType = assignment.workTypePattern.workTypes[assignment.currentCycle % assignment.workTypePattern.workTypes.length];
    return currentWorkType;
  };

  // Form handling functions
  const handleFormChange = (field: string, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateAssignment = async () => {
    if (!createForm.employee || !createForm.workTypePattern || !createForm.startDate) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setCreateForm({
        employee: '',
        workTypePattern: '',
        startDate: '',
        endDate: '',
        notes: ''
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="oh-dashboard">
      <Sidebar />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar pageTitle="Rotating Work Type Assign" />
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
                className={`oh-tab ${viewMode === 'assignments' ? 'oh-tab--active' : ''}`}
                onClick={() => setViewMode('assignments')}
              >
                Assignments ({stats.totalAssignments})
              </button>
              <button 
                className={`oh-tab ${viewMode === 'patterns' ? 'oh-tab--active' : ''}`}
                onClick={() => setViewMode('patterns')}
              >
                Work Type Patterns ({stats.totalPatterns})
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
                      <option value="Engineering">Engineering</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
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
                        <th>Work Type Pattern</th>
                        <th>Current Work Type</th>
                        <th>Cycle</th>
                        <th>Start Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((assignment) => {
                        const currentWorkType = getCurrentWorkType(assignment);
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
                                <div className="oh-pattern-name">{assignment.workTypePattern.name}</div>
                                <div className="oh-pattern-desc">{assignment.workTypePattern.description}</div>
                              </div>
                            </td>
                            <td>
                              <div className="oh-current-worktype">
                                <div className="oh-worktype-name">{currentWorkType?.name}</div>
                                <div className="oh-worktype-desc">{currentWorkType?.description}</div>
                                <div className="oh-worktype-remote">
                                  <span className={`oh-remote-badge ${currentWorkType?.isRemote ? 'oh-remote-badge--remote' : 'oh-remote-badge--office'}`}>
                                    {currentWorkType?.isRemote ? 'Remote' : 'On-site'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="oh-cycle-badge">Cycle {assignment.currentCycle}</span>
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
                          <span className="oh-pattern-detail__label">Work Types:</span>
                          <span className="oh-pattern-detail__value">{pattern.workTypes.length} types</span>
                        </div>
                      </div>

                      <div className="oh-pattern-card__worktypes">
                        {pattern.workTypes.map((workType, index) => (
                          <div key={workType.id} className="oh-worktype-item">
                            <div className="oh-worktype-item__header">
                              <div className="oh-worktype-item__name">{workType.name}</div>
                              <span className={`oh-remote-badge ${workType.isRemote ? 'oh-remote-badge--remote' : 'oh-remote-badge--office'}`}>
                                {workType.isRemote ? 'Remote' : 'On-site'}
                              </span>
                            </div>
                            <div className="oh-worktype-item__desc">{workType.description}</div>
                            <div className="oh-worktype-item__requirements">
                              <span className="oh-requirements-label">Requirements:</span>
                              <div className="oh-requirements-list">
                                {workType.requirements.map((req, reqIndex) => (
                                  <span key={reqIndex} className="oh-requirement-tag">{req}</span>
                                ))}
                              </div>
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
                    {viewMode === 'assignments' ? 'No assignments found' : 'No work type patterns found'}
                  </h3>
                  <p className="oh-empty-state__message">
                    {viewMode === 'assignments' 
                      ? 'No employees assigned to rotating work types.' 
                      : 'No work type patterns have been created yet.'}
                  </p>
                </div>
              )}
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
                  <select 
                    className="oh-form-input"
                    value={createForm.employee}
                    onChange={(e) => handleFormChange('employee', e.target.value)}
                  >
                    <option value="">Select employee</option>
                    {mockAssignments.map(assignment => (
                      <option key={assignment.employee.id} value={assignment.employee.id}>
                        {assignment.employee.name} - {assignment.employee.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Work Type Pattern <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.workTypePattern}
                    onChange={(e) => handleFormChange('workTypePattern', e.target.value)}
                  >
                    <option value="">Select work type pattern</option>
                    {mockWorkTypePatterns.filter(p => p.isActive).map(pattern => (
                      <option key={pattern.id} value={pattern.id}>
                        {pattern.name} - {pattern.rotationPeriod} days
                      </option>
                    ))}
                  </select>
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Start Date <span className="oh-required">*</span></label>
                  <input 
                    type="date"
                    className="oh-form-input"
                    value={createForm.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                  />
                </div>
                
                <div className="oh-form-group">
                  <label className="oh-form-label">End Date</label>
                  <input 
                    type="date"
                    className="oh-form-input"
                    value={createForm.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Notes</label>
                  <textarea 
                    className="oh-form-textarea"
                    rows={3}
                    placeholder="Additional notes for this assignment..."
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
              >
                Cancel
              </button>
              <button 
                className="oh-btn oh-btn--primary"
                onClick={handleCreateAssignment}
                disabled={isLoading || !createForm.employee || !createForm.workTypePattern || !createForm.startDate}
              >
                {isLoading ? (
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

      <QuickAccess />
    </div>
  );
};

export default RotatingWorkTypeAssign;
