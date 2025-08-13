import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Corrected import paths: changed '../../' to '../../../'
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../../contexts/SidebarContext';
import './EmployeeList.css';

// Corrected import paths: changed '../../' to '../../../'

import EmployeeCreateForm from '../../../components/employee/EmployeeCreateForm';
import { getAllEmployees, createEmployee } from '../../../services/employeeService';

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
  salary?: string;
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

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
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
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorEmployees, setErrorEmployees] = useState<string | null>(null);

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

  const { isCollapsed, toggleSidebar } = useSidebar();
  const itemsPerPage = 12;

  // Fetch employees from API
  useEffect(() => {
    setLoadingEmployees(true);
    setErrorEmployees(null);
    getAllEmployees()
      // Type assertion to help TypeScript
      .then((data => {
        const typedData = data as Employee[] | { results: Employee[] };
        if (Array.isArray(typedData)) {
          setEmployees(typedData as Employee[]);
        } else if (typedData && typeof typedData === 'object' && 'results' in typedData && Array.isArray(typedData.results)) {
          setEmployees(typedData.results as Employee[]);
        } else {
          setEmployees([]);
        }
        setLoadingEmployees(false);
      }))
      .catch((err: any) => { 
        console.error("Error fetching employees:", err);
        setErrorEmployees('Failed to load employees.');
        setLoadingEmployees(false);
      });
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  const departments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean)));

  const onlineCount = employees.filter(emp => emp.status === 'online').length;
  const offlineCount = employees.filter(emp => emp.status === 'offline').length;

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Generate next Badge ID
  const generateNextBadgeId = () => {
    const existingIds = employees.map(emp => emp.employeeId).filter(Boolean);
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
    const handleClickOutside = (event: MouseEvent) => { // Explicitly type 'event'
      if (activeDropdown && !(event.target as HTMLElement).closest('.oh-dropdown-container')) { // Added check for event.target
        setActiveDropdown(null);
      }
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
    if (!createForm.firstName || !createForm.phone || !createForm.country || !createForm.state || !createForm.zip || !createForm.qualification || !createForm.experience || !createForm.children || !createForm.emergencyContact || !createForm.emergencyContactName || !createForm.emergencyContactRelation) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Email validation (optional)
    if (createForm.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createForm.email)) {
        showNotification('error', 'Please enter a valid email address');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Prepare payload for API
      const payload = { // Removed 'any' here, let TypeScript infer based on properties, or define a specific type for the payload if different from CreateEmployeeForm
        employee_first_name: createForm.firstName,
        employee_last_name: createForm.lastName,
        email: createForm.email,
        phone: createForm.phone,
        address: createForm.city, // Assuming city as address, adjust as needed
        country: createForm.country,
        state: createForm.state,
        zip: createForm.zip,
        qualification: createForm.qualification,
        experience: createForm.experience,
        children: createForm.children,
        emergency_contact: createForm.emergencyContact,
        emergency_contact_name: createForm.emergencyContactName,
        emergency_contact_relation: createForm.emergencyContactRelation,
        // Add other fields from Employee interface that are not in CreateEmployeeForm if needed by the backend
        // For example:
        // department: 'Default Department', 
        // position: 'Default Position',
        // status: 'offline', // Assuming new employees start offline
        // hireDate: new Date().toISOString().split('T')[0], // Current date
        // employeeId: createForm.badgeId, // Using badgeId as employeeId for consistency
      };
      
      const response = await createEmployee(payload);
      // Type guard: check if response is a valid Employee object
      const isEmployee = (obj: any): obj is Employee =>
        obj && typeof obj === 'object' && 'id' in obj && 'employeeId' in obj && 'firstName' in obj && 'lastName' in obj;

      if (isEmployee(response)) {
        setEmployees(prev => [...prev, response]);
      } else {
        // fallback: refetch all employees if the created employee object doesn't match expected Employee interface
        const data = await getAllEmployees();
        if (Array.isArray(data)) {
          setEmployees(data as Employee[]);
        } else if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) { // Added type guard for 'data'
          setEmployees(data.results as Employee[]);
        } else {
          setEmployees([]);
        }
      }
      setShowCreateModal(false);
      resetForm();
      showNotification('success', `Employee ${createForm.firstName} ${createForm.lastName} created successfully!`);
    } catch (error: any) { // Explicitly type 'error'
      console.error("Error creating employee:", error); // Added console.error for debugging
      showNotification('error', 'Failed to create employee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="oh-app-layout">
      <Sidebar />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="oh-employees-container">
          {/* Modal for Create Employee */}
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
                  <EmployeeCreateForm onSuccess={() => setShowCreateModal(false)} />
                </div>
              </div>
            </div>
          )}
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
          {loadingEmployees ? (
            <div className="text-center py-10 text-gray-500">Loading employees...</div>
          ) : errorEmployees ? (
            <div className="text-center py-10 text-red-500">{errorEmployees}</div>
          ) : (
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
                          <Link to={`/employee/profile/${employee.id}`}>
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
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Badge Id</th>
                        <th>Job Position</th>
                        <th>Department</th>
                        <th>Shift</th>
                        <th>Work Type</th>
                        <th>Job Role</th>
                        <th>Reporting Manager</th>
                        <th>Company</th>
                        <th>Work Email</th>
                        <th>Date of Joining</th>
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
                                  <Link to={`/employee/profile/${employee.id}`}>
                                    {employee.firstName} {employee.lastName}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{employee.email || '-'}</td>
                          <td>{employee.phone || '-'}</td>
                          <td>{employee.employeeId || '-'}</td>
                          <td>{employee.position || '-'}</td>
                          <td>{employee.department || '-'}</td>
                          <td>-</td> {/* Shift not in Employee type */}
                          <td>-</td> {/* Work Type not in Employee type */}
                          <td>-</td> {/* Job Role not in Employee type */}
                          <td>-</td> {/* Manager not in local Employee type */}
                          <td>-</td> {/* Company not in Employee type */}
                          <td>-</td> {/* Work Email not in Employee type */}
                          <td>{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : '-'}</td>
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
          )}

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

  {/* ...existing code... */}
    </div>
  );
};

export default EmployeeList;