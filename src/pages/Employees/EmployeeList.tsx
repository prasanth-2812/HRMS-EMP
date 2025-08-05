import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './EmployeeList.css';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: 'online' | 'offline';
  hireDate: string;
  phone?: string;
  avatar?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  dob?: string;
  gender?: string;
  qualification?: string;
  experience?: string;
  maritalStatus?: string;
  children?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
}

interface CreateEmployeeForm {
  badgeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  dob: string;
  gender: string;
  qualification: string;
  experience: string;
  maritalStatus: string;
  children: string;
  emergencyContact: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Prasanth',
    lastName: 'Kathi',
    email: 'prasanthkathi05@gmail.com',
    department: 'Engineering',
    position: 'Software Developer',
    status: 'offline',
    hireDate: '2023-01-15',
    phone: '+1234567890',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'online',
    hireDate: '2022-08-20',
    phone: '+1234567891',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    status: 'online',
    hireDate: '2023-03-10',
    phone: '+1234567892',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Anna',
    lastName: 'Smith',
    email: 'anna.smith@company.com',
    department: 'HR',
    position: 'HR Manager',
    status: 'offline',
    hireDate: '2022-05-15',
    phone: '+1234567893',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    status: 'online',
    hireDate: '2023-02-20',
    phone: '+1234567894',
  },
];

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateEmployeeForm>({
    badgeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    dob: '',
    gender: '',
    qualification: '',
    experience: '',
    maritalStatus: '',
    children: '',
    emergencyContact: '',
    emergencyContactName: '',
    emergencyContactRelation: ''
  });
  
  const { isCollapsed } = useSidebar();
  
  const itemsPerPage = 12;

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  const onlineCount = employees.filter(emp => emp.status === 'online').length;
  const offlineCount = employees.filter(emp => emp.status === 'offline').length;

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Generate next Badge ID
  const generateNextBadgeId = () => {
    const existingIds = employees.map(emp => emp.employeeId);
    const numericIds = existingIds
      .filter(id => id.match(/^EMP\d+$/))
      .map(id => parseInt(id.replace('EMP', '')))
      .sort((a, b) => b - a);
    
    const nextNumber = numericIds.length > 0 ? numericIds[0] + 1 : 1;
    return `EMP${nextNumber.toString().padStart(3, '0')}`;
  };

  // Handle dropdown toggle
  const toggleDropdown = (employeeId: string) => {
    setActiveDropdown(activeDropdown === employeeId ? null : employeeId);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  // Handle employee actions
  const handleEditEmployee = (employee: Employee) => {
    setActiveDropdown(null);
    showNotification('info', `Edit functionality for ${employee.firstName} ${employee.lastName} will be implemented`);
  };

  const handleArchiveEmployee = (employee: Employee) => {
    setActiveDropdown(null);
    showNotification('info', `${employee.firstName} ${employee.lastName} has been archived`);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setActiveDropdown(null);
    if (window.confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
      showNotification('success', `${employee.firstName} ${employee.lastName} has been deleted`);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CreateEmployeeForm, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setCreateForm({
      badgeId: generateNextBadgeId(),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      zip: '',
      dob: '',
      gender: '',
      qualification: '',
      experience: '',
      maritalStatus: '',
      children: '',
      emergencyContact: '',
      emergencyContactName: '',
      emergencyContactRelation: ''
    });
  };

  // Initialize Badge ID when opening modal
  const handleOpenCreateModal = () => {
    setCreateForm(prev => ({
      ...prev,
      badgeId: generateNextBadgeId()
    }));
    setShowCreateModal(true);
  };

  // Handle create employee
  const handleCreateEmployee = async () => {
    // Validation
    if (!createForm.badgeId || !createForm.firstName || !createForm.lastName || !createForm.email) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }

    // Check if badge ID already exists
    if (employees.some(emp => emp.employeeId === createForm.badgeId)) {
      showNotification('error', 'Badge ID already exists');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newEmployee: Employee = {
        id: Date.now().toString(),
        employeeId: createForm.badgeId,
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        email: createForm.email,
        phone: createForm.phone,
        department: 'Not Assigned',
        position: 'Not Assigned',
        status: 'offline',
        hireDate: new Date().toISOString().split('T')[0],
        country: createForm.country,
        state: createForm.state,
        city: createForm.city,
        zip: createForm.zip,
        dob: createForm.dob,
        gender: createForm.gender,
        qualification: createForm.qualification,
        experience: createForm.experience,
        maritalStatus: createForm.maritalStatus,
        children: createForm.children,
        emergencyContact: createForm.emergencyContact,
        emergencyContactName: createForm.emergencyContactName,
        emergencyContactRelation: createForm.emergencyContactRelation
      };

      setEmployees(prev => [...prev, newEmployee]);
      setShowCreateModal(false);
      resetForm();
      showNotification('success', `Employee ${createForm.firstName} ${createForm.lastName} created successfully!`);
    } catch (error) {
      showNotification('error', 'Failed to create employee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="oh-app-layout">
      <Sidebar />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar pageTitle="Employees" />
        <div className="oh-employees-container">
          {/* Header */}
          <div className="oh-employees-header">
            <div className="oh-employees-title">
              <h1>Employees</h1>
              <div className="oh-employees-stats">
                <span className="oh-stat online">
                  <span className="oh-stat-dot online"></span>
                  Online ({onlineCount})
                </span>
                <span className="oh-stat offline">
                  <span className="oh-stat-dot offline"></span>
                  Offline ({offlineCount})
                </span>
              </div>
            </div>
            <div className="oh-employees-actions">
              <button 
                className="oh-btn oh-btn--primary oh-btn--icon"
                onClick={handleOpenCreateModal}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14m-7-7h14"></path>
                </svg>
                Create Employee
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="oh-employees-controls">
            <div className="oh-search-wrapper">
              <svg className="oh-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="oh-search-input"
              />
            </div>
            
            <div className="oh-controls-right">
              <div className="oh-view-toggle">
                <button 
                  className={`oh-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
                <button 
                  className={`oh-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
              </div>

              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="oh-filter-select"
              >
                <option value="">Filter</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <button className="oh-btn oh-btn-secondary">Group By</button>
              <button className="oh-btn oh-btn-secondary">Actions</button>
            </div>
          </div>

          {/* Employee Cards/List */}
          <div className={`oh-employees-content ${viewMode}`}>
            {viewMode === 'grid' ? (
              <div className="oh-employees-grid">
                {paginatedEmployees.map((employee) => (
                  <div key={employee.id} className="oh-employee-card">
                    <div className="oh-employee-card-header">
                      <div className="oh-employee-avatar">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=007bff&color=fff`}
                          alt={`${employee.firstName} ${employee.lastName}`}
                        />
                        <span className={`oh-status-indicator ${employee.status}`}></span>
                      </div>
                      <div className="oh-employee-actions">
                        <div className="oh-dropdown-container">
                          <button 
                            className="oh-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(employee.id);
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="12" cy="5" r="1"></circle>
                              <circle cx="12" cy="19" r="1"></circle>
                            </svg>
                          </button>
                          {activeDropdown === employee.id && (
                            <div className="oh-dropdown-menu">
                              <button 
                                className="oh-dropdown-item"
                                onClick={() => handleEditEmployee(employee)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                              </button>
                              <button 
                                className="oh-dropdown-item"
                                onClick={() => handleArchiveEmployee(employee)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="21,8 21,21 3,21 3,8"></polyline>
                                  <rect x="1" y="3" width="22" height="5"></rect>
                                  <line x1="10" y1="12" x2="14" y2="12"></line>
                                </svg>
                                Archive
                              </button>
                              <button 
                                className="oh-dropdown-item oh-dropdown-item-danger"
                                onClick={() => handleDeleteEmployee(employee)}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3,6 5,6 21,6"></polyline>
                                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="oh-employee-info">
                      <h3 className="oh-employee-name">
                        <Link to={`/employee/profile`}>
                          {employee.firstName} {employee.lastName}
                        </Link>
                      </h3>
                      <p className="oh-employee-email">{employee.email}</p>
                      <p className="oh-employee-details">None</p>
                      <div className="oh-employee-meta">
                        <span className={`oh-employee-status ${employee.status}`}>
                          {employee.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="oh-employees-table">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <div className="oh-table-employee">
                            <div className="oh-employee-avatar small">
                              <img 
                                src={`https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=007bff&color=fff`}
                                alt={`${employee.firstName} ${employee.lastName}`}
                              />
                              <span className={`oh-status-indicator ${employee.status}`}></span>
                            </div>
                            <div className="oh-employee-details">
                              <div className="oh-employee-name">
                                <Link to={`/employee/profile`}>
                                  {employee.firstName} {employee.lastName}
                                </Link>
                              </div>
                              <div className="oh-employee-email">{employee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{employee.employeeId}</td>
                        <td>{employee.department}</td>
                        <td>{employee.position}</td>
                        <td>
                          <span className={`oh-status-badge ${employee.status}`}>
                            {employee.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td>
                          <div className="oh-table-actions">
                            <div className="oh-dropdown-container">
                              <button 
                                className="oh-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(employee.id);
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="12" cy="5" r="1"></circle>
                                  <circle cx="12" cy="19" r="1"></circle>
                                </svg>
                              </button>
                              {activeDropdown === employee.id && (
                                <div className="oh-dropdown-menu">
                                  <button 
                                    className="oh-dropdown-item"
                                    onClick={() => handleEditEmployee(employee)}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                    Edit
                                  </button>
                                  <button 
                                    className="oh-dropdown-item"
                                    onClick={() => handleArchiveEmployee(employee)}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="21,8 21,21 3,21 3,8"></polyline>
                                      <rect x="1" y="3" width="22" height="5"></rect>
                                      <line x1="10" y1="12" x2="14" y2="12"></line>
                                    </svg>
                                    Archive
                                  </button>
                                  <button 
                                    className="oh-dropdown-item oh-dropdown-item-danger"
                                    onClick={() => handleDeleteEmployee(employee)}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3,6 5,6 21,6"></polyline>
                                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="oh-pagination">
            <div className="oh-pagination-info">
              Page {currentPage} of {totalPages}.
            </div>
            <div className="oh-pagination-controls">
              <span>Page</span>
              <select 
                value={currentPage} 
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="oh-page-select"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
              <span>of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
      <QuickAccess />

      {/* Notification */}
      {notification && (
        <div className={`oh-notification oh-notification-${notification.type}`}>
          <div className="oh-notification-content">
            <div className="oh-notification-icon">
              {notification.type === 'success' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
              )}
              {notification.type === 'error' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
              {notification.type === 'info' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
            </div>
            <div className="oh-notification-message">{notification.message}</div>
            <button 
              className="oh-notification-close"
              onClick={() => setNotification(null)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay">
          <div className="oh-create-employee-modal">
            <div className="oh-modal-header">
              <h2>Create New Employee</h2>
              <button 
                className="oh-modal-close-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="oh-modal-body">
              {/* Basic Information */}
              <div className="oh-form-section">
                <h3 className="oh-section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Basic Information
                </h3>
                <div className="oh-form-grid">
                  <div className="oh-form-field">
                    <label htmlFor="badgeId">Badge ID *</label>
                    <input
                      id="badgeId"
                      type="text"
                      value={createForm.badgeId}
                      placeholder="Auto-generated"
                      className="oh-form-input oh-form-input-readonly"
                      readOnly
                    />
                    <small className="oh-field-help">Badge ID is auto-generated</small>
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      id="firstName"
                      type="text"
                      value={createForm.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className="oh-form-input"
                      required
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      id="lastName"
                      type="text"
                      value={createForm.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className="oh-form-input"
                      required
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      type="email"
                      value={createForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="oh-form-input"
                      required
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      value={createForm.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="oh-form-input"
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      value={createForm.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className="oh-form-input"
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="gender">Gender</label>
                    <select
                      id="gender"
                      value={createForm.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="oh-form-select"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="oh-form-section">
                <h3 className="oh-section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Address Information
                </h3>
                <div className="oh-form-grid">
                  <div className="oh-form-field">
                    <label htmlFor="country">Country</label>
                    <input
                      id="country"
                      type="text"
                      value={createForm.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter country"
                      className="oh-form-input"
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="state">State</label>
                    <input
                      id="state"
                      type="text"
                      value={createForm.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="Enter state"
                      className="oh-form-input"
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      value={createForm.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter city"
                      className="oh-form-input"
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="zip">ZIP/Postal Code</label>
                    <input
                      id="zip"
                      type="text"
                      value={createForm.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      placeholder="Enter ZIP code"
                      className="oh-form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="oh-form-section">
                <h3 className="oh-section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  Professional Information
                </h3>
                <div className="oh-form-grid">
                  <div className="oh-form-field">
                    <label htmlFor="qualification">Qualification</label>
                    <input
                      id="qualification"
                      type="text"
                      value={createForm.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                      placeholder="Enter qualification"
                      className="oh-form-input"
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="experience">Experience</label>
                    <input
                      id="experience"
                      type="text"
                      value={createForm.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Enter experience"
                      className="oh-form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="oh-form-section">
                <h3 className="oh-section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Personal Information
                </h3>
                <div className="oh-form-grid">
                  <div className="oh-form-field">
                    <label htmlFor="maritalStatus">Marital Status</label>
                    <select
                      id="maritalStatus"
                      value={createForm.maritalStatus}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      className="oh-form-select"
                    >
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="children">Children</label>
                    <input
                      id="children"
                      type="number"
                      min="0"
                      value={createForm.children}
                      onChange={(e) => handleInputChange('children', e.target.value)}
                      placeholder="Number of children"
                      className="oh-form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="oh-form-section">
                <h3 className="oh-section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Emergency Contact
                </h3>
                <div className="oh-form-grid">
                  <div className="oh-form-field">
                    <label htmlFor="emergencyContactName">Contact Name</label>
                    <input
                      id="emergencyContactName"
                      type="text"
                      value={createForm.emergencyContactName}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      placeholder="Enter contact name"
                      className="oh-form-input"
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="emergencyContact">Contact Number</label>
                    <input
                      id="emergencyContact"
                      type="tel"
                      value={createForm.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="Enter contact number"
                      className="oh-form-input"
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="emergencyContactRelation">Relationship</label>
                    <select
                      id="emergencyContactRelation"
                      value={createForm.emergencyContactRelation}
                      onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                      className="oh-form-select"
                    >
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend</option>
                      <option value="Relative">Relative</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="oh-modal-footer">
              <button 
                className="oh-btn oh-btn-secondary"
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="oh-btn oh-btn-primary oh-btn-create"
                onClick={handleCreateEmployee}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="oh-loading-spinner"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14m-7-7h14"></path>
                    </svg>
                    Create Employee
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
