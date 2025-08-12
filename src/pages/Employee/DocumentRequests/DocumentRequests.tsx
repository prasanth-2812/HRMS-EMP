import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Navbar from '../../../components/Layout/Navbar';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../../contexts/SidebarContext';
import './DocumentRequests.css';
import { 
  getAllDocumentRequests, 
  createDocumentRequest, 
  updateDocumentRequest, 
  deleteDocumentRequest,
  getEmployeeSelector
} from '../../../services/employeeService';

interface DocumentRequest {
  id: number;
  title: string;
  employee_id: number[];
  format: string;
  max_size?: number;
  description?: string;
  created_at: string;
  is_active: boolean;
  created_by: number;
  modified_by: number;
}

interface Employee {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  badge_id: string;
  employee_profile?: string;
}

interface CreateDocumentRequestForm {
  title: string;
  employee_id: number[];
  format: string;
  max_size: string;
  description: string;
}

const DocumentRequests: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<DocumentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateDocumentRequestForm>({
    title: '',
    employee_id: [],
    format: '',
    max_size: '',
    description: ''
  });

  // Filter requests based on search and filters
  const filteredRequests = documentRequests.filter(request => {
    const employeeNames = request.employee_id.map(empId => {
      const employee = employees.find(emp => emp.id === empId);
      return employee ? `${employee.employee_first_name} ${employee.employee_last_name}` : '';
    }).join(' ');
    
    const matchesSearch = searchTerm === '' ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeeNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.description && request.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && request.is_active) ||
      (statusFilter === 'inactive' && !request.is_active);
    
    const matchesFormat = formatFilter === 'all' || request.format.toLowerCase() === formatFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesFormat;
  });

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch document requests from API
  const fetchDocumentRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching document requests...');
      const response = await getAllDocumentRequests() as any;
      console.log('Document requests response:', response);
      
      // Handle different response structures
      if (response?.results) {
        setDocumentRequests(response.results);
        console.log('Set document requests from response.results:', response.results);
      } else if (response?.data?.results) {
        setDocumentRequests(response.data.results);
        console.log('Set document requests from response.data.results:', response.data.results);
      } else if (Array.isArray(response)) {
        setDocumentRequests(response);
        console.log('Set document requests from array response:', response);
      } else if (Array.isArray(response?.data)) {
        setDocumentRequests(response.data);
        console.log('Set document requests from response.data array:', response.data);
      } else {
        console.log('No document requests found in response');
        setDocumentRequests([]);
      }
    } catch (error: any) {
      console.error('Error fetching document requests:', error);
      let errorMessage = 'Failed to fetch document requests';
      
      if (error?.message?.includes('401') || error?.message?.includes('Authentication')) {
        errorMessage = 'Authentication required. Please login first.';
      } else if (error?.message?.includes('403')) {
        errorMessage = 'Access denied. You do not have permission to view document requests.';
      } else if (error?.message?.includes('404')) {
        errorMessage = 'Document requests endpoint not found. Please check the API configuration.';
      } else if (error?.message?.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      showNotification('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch employees for dropdown
  const fetchEmployees = useCallback(async () => {
    try {
      console.log('Fetching employees...');
      const response = await getEmployeeSelector() as any;
      console.log('Employees response:', response);
      
      // Handle different response structures
      if (response?.results) {
        setEmployees(response.results);
        console.log('Set employees from response.results:', response.results);
      } else if (response?.data?.results) {
        setEmployees(response.data.results);
        console.log('Set employees from response.data.results:', response.data.results);
      } else if (Array.isArray(response)) {
        setEmployees(response);
        console.log('Set employees from array response:', response);
      } else if (Array.isArray(response?.data)) {
        setEmployees(response.data);
        console.log('Set employees from response.data array:', response.data);
      } else {
        console.log('No employees found in response');
        setEmployees([]);
        showNotification('info', 'No employees found for selection');
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      let errorMessage = 'Failed to fetch employees';
      
      if (error?.message?.includes('401') || error?.message?.includes('Authentication')) {
        errorMessage = 'Authentication required to fetch employees';
      }
      
      showNotification('error', errorMessage);
      setEmployees([]);
    }
  }, []);

  // Check authentication and load data
  const checkAuthAndLoadData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log('No auth token found, using mock data for testing');
      showNotification('info', 'Using demo data - Please login for real data');
      
      // Mock data for testing
      const mockEmployees = [
        { id: 1, employee_first_name: 'John', employee_last_name: 'Doe', badge_id: 'EMP001' },
        { id: 2, employee_first_name: 'Jane', employee_last_name: 'Smith', badge_id: 'EMP002' },
        { id: 3, employee_first_name: 'Mike', employee_last_name: 'Johnson', badge_id: 'EMP003' }
      ];
      
      const mockDocumentRequests = [
        {
          id: 1,
          title: 'Employment Certificate',
          employee_id: [1, 2],
          format: 'pdf',
          max_size: 5,
          description: 'Employment certificate for visa application',
          is_active: true,
          created_at: new Date().toISOString(),
          created_by: 1,
          modified_by: 1
        },
        {
          id: 2,
          title: 'Salary Certificate',
          employee_id: [3],
          format: 'docx',
          max_size: 2,
          description: 'Salary certificate for bank loan',
          is_active: true,
          created_at: new Date().toISOString(),
          created_by: 1,
          modified_by: 1
        }
      ];
      
      setEmployees(mockEmployees);
      setDocumentRequests(mockDocumentRequests);
      return;
    }
    
    // If authenticated, fetch real data
    await fetchDocumentRequests();
    await fetchEmployees();
  }, [fetchDocumentRequests, fetchEmployees]);

  // Load data on component mount
  useEffect(() => {
    checkAuthAndLoadData();
  }, [checkAuthAndLoadData]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle input changes
  const handleInputChange = (field: keyof CreateDocumentRequestForm, value: string | number[]) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setCreateForm({
      title: '',
      employee_id: [],
      format: '',
      max_size: '',
      description: ''
    });
    setEditingRequest(null);
  };

  const handleEditClick = (request: DocumentRequest) => {
    setEditingRequest(request);
    setCreateForm({
      title: request.title,
      employee_id: request.employee_id,
      format: request.format,
      max_size: request.max_size?.toString() || '',
      description: request.description || ''
    });
    setShowCreateModal(true);
  };

  // Handle create document request
  const handleCreateDocumentRequest = async () => {
    // Validation
    if (!createForm.title || createForm.employee_id.length === 0 || !createForm.format) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Validate max size format
    if (createForm.max_size && isNaN(Number(createForm.max_size))) {
      showNotification('error', 'Max size must be a valid number');
      return;
    }

    setIsLoading(true);

    try {
      const requestData = {
        title: createForm.title,
        employee_id: createForm.employee_id,
        format: createForm.format.toLowerCase(),
        max_size: createForm.max_size ? parseInt(createForm.max_size) : null,
        description: createForm.description || ''
      };

      if (editingRequest) {
         // Update existing request
         const response = await updateDocumentRequest(editingRequest.id, requestData) as any;
         
         if (response?.data) {
           await fetchDocumentRequests(); // Refresh the list
           setShowCreateModal(false);
           resetForm();
           showNotification('success', 'Document request updated successfully!');
         }
       } else {
         // Create new request
         const response = await createDocumentRequest(requestData) as any;
         
         if (response?.data) {
           await fetchDocumentRequests(); // Refresh the list
           setShowCreateModal(false);
           resetForm();
           showNotification('success', `Document request "${createForm.title}" created successfully!`);
         }
       }
    } catch (error: any) {
      console.error('Error creating document request:', error);
      showNotification('error', error.response?.data?.message || 'Failed to create document request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  // Handle delete document request
  const handleDeleteDocumentRequest = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this document request?')) {
      return;
    }

    try {
      await deleteDocumentRequest(id);
      await fetchDocumentRequests(); // Refresh the list
      showNotification('success', 'Document request deleted successfully');
    } catch (error: any) {
      console.error('Error deleting document request:', error);
      showNotification('error', error.response?.data?.message || 'Failed to delete document request');
    }
  };



  // Status counts for stats
  const statusCounts = {
    total: documentRequests.length,
    active: documentRequests.filter(req => req.is_active).length,
    inactive: documentRequests.filter(req => !req.is_active).length,
    pdf: documentRequests.filter(req => req.format.toLowerCase() === 'pdf').length,
    docx: documentRequests.filter(req => req.format.toLowerCase() === 'docx').length
  };

  const getStatusClass = (isActive: boolean) => {
    return isActive ? 'oh-status-badge oh-status-active' : 'oh-status-badge oh-status-inactive';
  };

  const getFormatClass = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf': return 'oh-format-badge oh-format-pdf';
      case 'docx': return 'oh-format-badge oh-format-docx';
      case 'xlsx': return 'oh-format-badge oh-format-xlsx';
      case 'jpg': return 'oh-format-badge oh-format-jpg';
      case 'png': return 'oh-format-badge oh-format-png';
      default: return 'oh-format-badge oh-format-default';
    }
  };

  // Get employee names
  const getEmployeeNames = (employeeIds: number[]) => {
    return employeeIds.map(empId => {
      const employee = employees.find(emp => emp.id === empId);
      return employee ? `${employee.employee_first_name} ${employee.employee_last_name}` : 'Unknown';
    }).join(', ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="oh-app-layout">
      <Sidebar />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar pageTitle="Document Requests" />
        <div className="oh-document-requests-container">
          {/* Header */}
          <div className="oh-document-requests-header">
            <div className="oh-document-requests-title">
              <h1>Document Requests</h1>
              <div className="oh-document-requests-stats">
                <span className="oh-stat">
                  <span className="oh-stat-label">Total:</span>
                  <span className="oh-stat-value">{statusCounts.total}</span>
                </span>
                <span className="oh-stat active">
                  <span className="oh-stat-dot active"></span>
                  Active ({statusCounts.active})
                </span>
                <span className="oh-stat inactive">
                  <span className="oh-stat-dot inactive"></span>
                  Inactive ({statusCounts.inactive})
                </span>
                <span className="oh-stat pdf">
                  <span className="oh-stat-dot pdf"></span>
                  PDF ({statusCounts.pdf})
                </span>
                <span className="oh-stat docx">
                  <span className="oh-stat-dot docx"></span>
                  DOCX ({statusCounts.docx})
                </span>
              </div>
            </div>
            <div className="oh-document-requests-actions">
              <button 
                className="oh-btn oh-btn-secondary oh-btn--icon"
                onClick={() => checkAuthAndLoadData()}
                disabled={isLoading}
                title="Refresh data"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
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

          {/* Controls */}
          <div className="oh-document-requests-controls">
            <div className="oh-search-wrapper">
              <svg className="oh-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search requests..."
                className="oh-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="oh-controls-right">
              <select
                className="oh-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                className="oh-filter-select"
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
              >
                <option value="all">All Formats</option>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="xlsx">XLSX</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>

              <div className="oh-view-toggle">
                <button
                  className={`oh-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <div className={`oh-document-requests-content ${viewMode}`}>
            {filteredRequests.length === 0 ? (
              <div className="oh-no-results">
                <div className="oh-no-results-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <h3>No Records found.</h3>
                <p>No documents found.</p>
              </div>
            ) : viewMode === 'list' ? (
              <div className="oh-document-requests-table-wrapper">
                <table className="oh-document-requests-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Employee(s)</th>
                      <th>Format</th>
                      <th>Max Size (MB)</th>
                      <th>Created Date</th>
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
                            <div className="oh-employee-name">{request.title}</div>
                          </div>
                        </td>
                        <td>
                          <span className="oh-document-type">{getEmployeeNames(request.employee_id)}</span>
                        </td>
                        <td>
                          <span className={getFormatClass(request.format)}>
                            {request.format?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className="oh-date">{request.max_size || 'N/A'}</span>
                        </td>
                        <td>
                          <span className="oh-date">{formatDate(request.created_at)}</span>
                        </td>
                        <td>
                          <span className={getStatusClass(request.is_active)}>
                            {request.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="oh-actions">
                            <button className="oh-action-btn oh-action-btn--view" title="View Details">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            {request.is_active && (
                              <>
                                <button 
                                  className="oh-action-btn oh-action-btn--edit" 
                                  title="Edit Request"
                                  onClick={() => handleEditClick(request)}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </button>
                                <button 
                                  className="oh-action-btn oh-action-btn--delete" 
                                  title="Delete Request"
                                  onClick={() => handleDeleteDocumentRequest(request.id)}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3,6 5,6 21,6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="oh-document-requests-grid">
                {filteredRequests.map((request) => (
                  <div key={request.id} className="oh-document-request-card">
                    <div className="oh-card-header">
                      <div className="oh-card-title">
                        <span className="oh-request-id">#{request.id}</span>
                        <span className={`oh-format-badge ${getFormatClass(request.format)}`}>
                          {request.format?.toUpperCase()}
                        </span>
                      </div>
                      <span className={`oh-status-badge ${getStatusClass(request.is_active)}`}>
                        {request.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="oh-card-content">
                      <div className="oh-card-field">
                        <label>Title:</label>
                        <span>{request.title}</span>
                      </div>
                      <div className="oh-card-field">
                        <label>Employee(s):</label>
                        <span>{getEmployeeNames(request.employee_id)}</span>
                      </div>
                      <div className="oh-card-field">
                        <label>Max Size:</label>
                        <span>{request.max_size ? `${request.max_size} MB` : 'N/A'}</span>
                      </div>
                      <div className="oh-card-field">
                        <label>Created Date:</label>
                        <span>{formatDate(request.created_at)}</span>
                      </div>
                      {request.description && (
                        <div className="oh-card-field">
                          <label>Description:</label>
                          <span>{request.description}</span>
                        </div>
                      )}
                    </div>
                    <div className="oh-card-actions">
                      <button className="oh-action-btn oh-action-btn--view" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      {request.is_active && (
                        <>
                          <button 
                            className="oh-action-btn oh-action-btn--edit" 
                            title="Edit Request"
                            onClick={() => {
                              setEditingRequest(request);
                              setCreateForm({
                                title: request.title,
                                employee_id: request.employee_id,
                                format: request.format,
                                max_size: request.max_size?.toString() || '',
                                description: request.description || ''
                              });
                              setShowCreateModal(true);
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button 
                            className="oh-action-btn oh-action-btn--delete" 
                            title="Delete Request"
                            onClick={() => handleDeleteDocumentRequest(request.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {/* Create Document Request Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay">
          <div className="oh-create-document-modal">
            <div className="oh-modal-header">
              <h2>{editingRequest ? 'Edit Document Request' : 'Create Document Request'}</h2>
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
              <div className="oh-form-section">
                <h3 className="oh-section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                  Document Request Details
                </h3>
                <div className="oh-form-grid">
                  <div className="oh-form-field">
                    <label htmlFor="title">Title *</label>
                    <input
                      id="title"
                      type="text"
                      value={createForm.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter document title"
                      className="oh-form-input"
                      required
                    />
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="employee_id">Employee(s) *</label>
                    {employees.length === 0 ? (
                      <div className="oh-form-select-placeholder">
                        <div className="oh-loading-message">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                          </svg>
                          Loading employees...
                        </div>
                        <button 
                          type="button"
                          onClick={() => checkAuthAndLoadData()}
                          className="oh-btn oh-btn-sm oh-btn-secondary"
                          style={{ marginTop: '8px' }}
                        >
                          Retry Loading
                        </button>
                      </div>
                    ) : (
                      <select
                        id="employee_id"
                        multiple
                        value={createForm.employee_id.map(id => id.toString())}
                        onChange={(e) => {
                          const selectedValues = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                          handleInputChange('employee_id', selectedValues);
                        }}
                        className="oh-form-select"
                        required
                        style={{ height: '120px', minHeight: '120px' }}
                      >
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.employee_first_name} {employee.employee_last_name} ({employee.badge_id})
                          </option>
                        ))}
                      </select>
                    )}
                    <small className="oh-field-help">
                      {employees.length > 0 
                        ? `Hold Ctrl/Cmd to select multiple employees (${employees.length} available)`
                        : 'No employees available - check your connection or login status'
                      }
                    </small>
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="format">Format *</label>
                    <select
                      id="format"
                      value={createForm.format}
                      onChange={(e) => handleInputChange('format', e.target.value)}
                      className="oh-form-select"
                      required
                    >
                      <option value="">Select format</option>
                      <option value="pdf">PDF</option>
                      <option value="txt">TXT</option>
                      <option value="docx">DOCX</option>
                      <option value="xlsx">XLSX</option>
                      <option value="jpg">JPG</option>
                      <option value="png">PNG</option>
                    </select>
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="max_size">Max Size (In MB)</label>
                    <input
                      id="max_size"
                      type="number"
                      min="0"
                      step="0.1"
                      value={createForm.max_size}
                      onChange={(e) => handleInputChange('max_size', e.target.value)}
                      placeholder="Enter max file size"
                      className="oh-form-input"
                    />
                    <small className="oh-field-help">Maximum file size in megabytes (optional)</small>
                  </div>
                  <div className="oh-form-field oh-form-field-full">
                    <label htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={createForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter document description or purpose"
                      className="oh-form-textarea"
                      rows={3}
                    />
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
                className="oh-btn oh-btn--primary oh-btn-create"
                onClick={handleCreateDocumentRequest}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="oh-loading-spinner"></div>
                    {editingRequest ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14m-7-7h14"></path>
                    </svg>
                    {editingRequest ? 'Update Request' : 'Create Request'}
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

export default DocumentRequests;
