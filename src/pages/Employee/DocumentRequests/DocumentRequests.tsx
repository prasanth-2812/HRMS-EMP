import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../components/Layout/Sidebar';
import Navbar from '../../../components/Layout/Navbar';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../../contexts/SidebarContext';
import './DocumentRequests.css';

interface DocumentRequest {
  id: string;
  requestId: string;
  employeeName: string;
  employeeId: string;
  documentType: string;
  purpose: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  approvedBy?: string;
  approvedDate?: string;
  completedDate?: string;
  remarks?: string;
  urgency: 'low' | 'medium' | 'high';
}

interface CreateDocumentRequestForm {
  title: string;
  employee: string;
  format: string;
  maxSize: string;
  description: string;
}

const mockDocumentRequests: DocumentRequest[] = [
  {
    id: '1',
    requestId: 'DOC001',
    employeeName: 'Prasanth Kathi',
    employeeId: 'EMP001',
    documentType: 'Experience Certificate',
    purpose: 'Job Application',
    requestDate: '2024-01-15',
    status: 'approved',
    approvedBy: 'HR Manager',
    approvedDate: '2024-01-16',
    urgency: 'medium',
    remarks: 'Processing for external job application'
  },
  {
    id: '2',
    requestId: 'DOC002',
    employeeName: 'Sarah Wilson',
    employeeId: 'EMP002',
    documentType: 'Salary Certificate',
    purpose: 'Bank Loan',
    requestDate: '2024-01-14',
    status: 'completed',
    approvedBy: 'HR Manager',
    approvedDate: '2024-01-15',
    completedDate: '2024-01-16',
    urgency: 'high',
    remarks: 'Urgent requirement for loan processing'
  },
  {
    id: '3',
    requestId: 'DOC003',
    employeeName: 'Michael Brown',
    employeeId: 'EMP003',
    documentType: 'Employment Letter',
    purpose: 'Visa Application',
    requestDate: '2024-01-13',
    status: 'pending',
    urgency: 'high',
    remarks: 'Required for visa processing - urgent'
  },
  {
    id: '4',
    requestId: 'DOC004',
    employeeName: 'Emma Davis',
    employeeId: 'EMP004',
    documentType: 'Relieving Letter',
    purpose: 'Personal Records',
    requestDate: '2024-01-12',
    status: 'rejected',
    urgency: 'low',
    remarks: 'Employee still active - cannot issue relieving letter'
  },
  {
    id: '5',
    requestId: 'DOC005',
    employeeName: 'James Wilson',
    employeeId: 'EMP005',
    documentType: 'Payslip',
    purpose: 'Income Proof',
    requestDate: '2024-01-11',
    status: 'approved',
    approvedBy: 'Finance Manager',
    approvedDate: '2024-01-12',
    urgency: 'medium'
  }
];

const DocumentRequests: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [requests, setRequests] = useState<DocumentRequest[]>(mockDocumentRequests);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);
  
  const [createForm, setCreateForm] = useState<CreateDocumentRequestForm>({
    title: '',
    employee: '',
    format: '',
    maxSize: '',
    description: ''
  });

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Generate next request ID
  const generateNextRequestId = () => {
    const existingIds = requests.map(req => req.requestId);
    const numericIds = existingIds
      .filter(id => id.match(/^DOC\d+$/))
      .map(id => parseInt(id.replace('DOC', '')))
      .sort((a, b) => b - a);
    
    const nextNumber = numericIds.length > 0 ? numericIds[0] + 1 : 1;
    return `DOC${nextNumber.toString().padStart(3, '0')}`;
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CreateDocumentRequestForm, value: string) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset form
  const resetForm = () => {
    setCreateForm({
      title: '',
      employee: '',
      format: '',
      maxSize: '',
      description: ''
    });
  };

  // Handle create document request
  const handleCreateDocumentRequest = async () => {
    // Validation
    if (!createForm.title || !createForm.employee || !createForm.format) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    // Validate max size format
    if (createForm.maxSize && isNaN(Number(createForm.maxSize))) {
      showNotification('error', 'Max size must be a valid number');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRequest: DocumentRequest = {
        id: Date.now().toString(),
        requestId: generateNextRequestId(),
        employeeName: createForm.employee,
        employeeId: 'EMP001', // This would come from employee selection
        documentType: createForm.title,
        purpose: createForm.description || 'No description provided',
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        urgency: 'medium',
        remarks: `Format: ${createForm.format}${createForm.maxSize ? `, Max size: ${createForm.maxSize}MB` : ''}`
      };

      setRequests(prev => [newRequest, ...prev]);
      setShowCreateModal(false);
      resetForm();
      showNotification('success', `Document request "${createForm.title}" created successfully!`);
    } catch (error) {
      showNotification('error', 'Failed to create document request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Status counts for stats
  const statusCounts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'oh-status oh-status--pending';
      case 'approved': return 'oh-status oh-status--approved';
      case 'completed': return 'oh-status oh-status--completed';
      case 'rejected': return 'oh-status oh-status--rejected';
      default: return 'oh-status';
    }
  };

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'oh-urgency oh-urgency--high';
      case 'medium': return 'oh-urgency oh-urgency--medium';
      case 'low': return 'oh-urgency oh-urgency--low';
      default: return 'oh-urgency';
    }
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
                <span className="oh-stat pending">
                  <span className="oh-stat-dot pending"></span>
                  Pending ({statusCounts.pending})
                </span>
                <span className="oh-stat approved">
                  <span className="oh-stat-dot approved"></span>
                  Approved ({statusCounts.approved})
                </span>
                <span className="oh-stat completed">
                  <span className="oh-stat-dot completed"></span>
                  Completed ({statusCounts.completed})
                </span>
                <span className="oh-stat rejected">
                  <span className="oh-stat-dot rejected"></span>
                  Rejected ({statusCounts.rejected})
                </span>
              </div>
            </div>
            <div className="oh-document-requests-actions">
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                className="oh-filter-select"
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
              >
                <option value="all">All Urgency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
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
                      <th>Request ID</th>
                      <th>Employee</th>
                      <th>Document Type</th>
                      <th>Purpose</th>
                      <th>Request Date</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          <span className="oh-request-id">{request.requestId}</span>
                        </td>
                        <td>
                          <div className="oh-employee-info">
                            <div className="oh-employee-name">{request.employeeName}</div>
                            <div className="oh-employee-id">{request.employeeId}</div>
                          </div>
                        </td>
                        <td>
                          <span className="oh-document-type">{request.documentType}</span>
                        </td>
                        <td>
                          <span className="oh-purpose">{request.purpose}</span>
                        </td>
                        <td>
                          <span className="oh-date">{formatDate(request.requestDate)}</span>
                        </td>
                        <td>
                          <span className={getUrgencyClass(request.urgency)}>
                            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={getStatusClass(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
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
                            {request.status === 'pending' && (
                              <>
                                <button className="oh-action-btn oh-action-btn--edit" title="Edit Request">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                </button>
                                <button className="oh-action-btn oh-action-btn--delete" title="Delete Request">
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
                        <span className="oh-request-id">{request.requestId}</span>
                        <span className={getUrgencyClass(request.urgency)}>
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                        </span>
                      </div>
                      <span className={getStatusClass(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <div className="oh-card-content">
                      <div className="oh-card-field">
                        <label>Employee:</label>
                        <span>{request.employeeName} ({request.employeeId})</span>
                      </div>
                      <div className="oh-card-field">
                        <label>Document Type:</label>
                        <span>{request.documentType}</span>
                      </div>
                      <div className="oh-card-field">
                        <label>Purpose:</label>
                        <span>{request.purpose}</span>
                      </div>
                      <div className="oh-card-field">
                        <label>Request Date:</label>
                        <span>{formatDate(request.requestDate)}</span>
                      </div>
                      {request.remarks && (
                        <div className="oh-card-field">
                          <label>Remarks:</label>
                          <span>{request.remarks}</span>
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
                      {request.status === 'pending' && (
                        <>
                          <button className="oh-action-btn oh-action-btn--edit" title="Edit Request">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button className="oh-action-btn oh-action-btn--delete" title="Delete Request">
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
              <h2>Create Document Request</h2>
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
                    <label htmlFor="employee">Employee *</label>
                    <select
                      id="employee"
                      value={createForm.employee}
                      onChange={(e) => handleInputChange('employee', e.target.value)}
                      className="oh-form-select"
                      required
                    >
                      <option value="">Select employee</option>
                      <option value="Prasanth Kathi">Prasanth Kathi (EMP001)</option>
                      <option value="Sarah Wilson">Sarah Wilson (EMP002)</option>
                      <option value="Michael Brown">Michael Brown (EMP003)</option>
                      <option value="Emma Davis">Emma Davis (EMP004)</option>
                      <option value="James Wilson">James Wilson (EMP005)</option>
                    </select>
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
                      <option value="PDF">PDF</option>
                      <option value="DOC">DOC</option>
                      <option value="DOCX">DOCX</option>
                      <option value="JPG">JPG</option>
                      <option value="PNG">PNG</option>
                      <option value="Excel">Excel</option>
                    </select>
                  </div>
                  <div className="oh-form-field">
                    <label htmlFor="maxSize">Max Size (In MB)</label>
                    <input
                      id="maxSize"
                      type="number"
                      min="0"
                      step="0.1"
                      value={createForm.maxSize}
                      onChange={(e) => handleInputChange('maxSize', e.target.value)}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14m-7-7h14"></path>
                    </svg>
                    Create Request
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
