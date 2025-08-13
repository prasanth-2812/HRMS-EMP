import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import { useSidebar } from '../../../contexts/SidebarContext';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import { getAllPolicies, createPolicy, updatePolicy, deletePolicy } from '../../../services/employeeService';
import './Policies.css';

// Policy interface matching backend structure
interface Policy {
  id: number;
  title: string;
  body: string;
  is_active: boolean;
  is_visible_to_all: boolean;
  created_at: string;
  created_by: number;
  modified_by: number;
  specific_employees: number[];
  attachments: any[];
  company_id: number[];
}

const Policies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<Policy | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Create form state matching backend structure
  const [createForm, setCreateForm] = useState({
    title: '',
    body: '',
    is_visible_to_all: true,
    specific_employees: [] as number[],
    attachments: [] as any[],
    company_id: [] as number[]
  });

  // API Functions
  const fetchPolicies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: any = await getAllPolicies();
      if (response?.results) {
        setPolicies(response.results);
      } else if (Array.isArray(response)) {
        setPolicies(response);
      } else {
        setPolicies([]);
      }
    } catch (err: any) {
      console.error('Error fetching policies:', err);
      setError(err.message || 'Failed to fetch policies');
      setPolicies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load policies on component mount
  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // Form handling functions
  const handleFormChange = (field: string, value: string | boolean | number[]) => {
    if (editingPolicy) {
      setEditingPolicy(prev => prev ? {
        ...prev,
        [field]: value
      } : null);
    } else {
      setCreateForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleCreatePolicy = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!createForm.title || !createForm.body) {
      setError('Title and body are required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const policyData = {
        title: createForm.title,
        body: createForm.body,
        is_visible_to_all: createForm.is_visible_to_all,
        specific_employees: createForm.specific_employees,
        attachments: createForm.attachments,
        company_id: createForm.company_id
      };

      await createPolicy(policyData);
      await fetchPolicies(); // Refresh the list
      setShowCreateModal(false);
      resetForm();
    } catch (err: any) {
      console.error('Error creating policy:', err);
      setError(err.message || 'Failed to create policy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePolicy = async (id: number, data: Partial<Policy>) => {
    try {
      setIsLoading(true);
      setError(null);
      await updatePolicy(id, data);
      await fetchPolicies(); // Refresh the list
      setEditingPolicy(null);
    } catch (err: any) {
      console.error('Error updating policy:', err);
      setError(err.message || 'Failed to update policy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePolicy = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this policy?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await deletePolicy(id);
      await fetchPolicies(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting policy:', err);
      setError(err.message || 'Failed to delete policy');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCreateForm({
      title: '',
      body: '',
      is_visible_to_all: true,
      specific_employees: [],
      attachments: [],
      company_id: []
    });
  };

  // Filter and search logic
  const filteredPolicies = useMemo(() => {
    return policies.filter(policy => {
      const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          policy.body.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && policy.is_active) ||
                          (statusFilter === 'inactive' && !policy.is_active);
      
      return matchesSearch && matchesStatus;
    });
  }, [policies, searchTerm, statusFilter]);

  // Statistics
  const policyStats = useMemo(() => {
    const total = policies.length;
    const active = policies.filter(p => p.is_active).length;
    const inactive = policies.filter(p => !p.is_active).length;
    const visibleToAll = policies.filter(p => p.is_visible_to_all).length;
    const restricted = policies.filter(p => !p.is_visible_to_all).length;
    
    return { total, active, inactive, visibleToAll, restricted };
  }, [policies]);

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getVisibilityBadge = (isVisibleToAll: boolean) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isVisibleToAll 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-orange-100 text-orange-800'
      }`}>
        {isVisibleToAll ? 'Public' : 'Restricted'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stripHtmlTags = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
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
                <h1 className="oh-page-title">Policies</h1>
                <p className="oh-page-subtitle">Manage company policies and track employee acknowledgments</p>
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
                  Create
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="oh-stats-grid">
              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--total">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{policyStats.total}</div>
                  <div className="oh-stat-card__label">Total Policies</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--active">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,11 12,14 22,4"></polyline>
                    <path d="m21,4 0,7 -5,0"></path>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{policyStats.active}</div>
                  <div className="oh-stat-card__label">Active</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--draft">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{policyStats.inactive}</div>
                  <div className="oh-stat-card__label">Inactive</div>
                </div>
              </div>

              <div className="oh-stat-card">
                <div className="oh-stat-card__icon oh-stat-card__icon--review">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <path d="M12 17h.01"></path>
                  </svg>
                </div>
                <div className="oh-stat-card__content">
                  <div className="oh-stat-card__value">{policyStats.visibleToAll}</div>
                  <div className="oh-stat-card__label">Public</div>
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
                    placeholder="Search policies..."
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
                  <option value="inactive">Inactive</option>
                </select>

                <button 
                  className="oh-btn oh-btn--secondary oh-btn--sm"
                  onClick={fetchPolicies}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                        <path d="M3 21v-5h5"></path>
                      </svg>
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="oh-alert oh-alert--error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                {error}
              </div>
            )}

            {/* Content Area */}
            <div className="oh-content-area">
              {isLoading && policies.length === 0 ? (
                <div className="oh-loading-state">
                  <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>Loading policies...</p>
                </div>
              ) : (
                <div className="oh-table-container">
                  <table className="oh-table">
                    <thead>
                      <tr>
                        <th>Policy</th>
                        <th>Status</th>
                        <th>Visibility</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPolicies.map((policy) => (
                        <tr key={policy.id}>
                          <td>
                            <div className="oh-policy-info">
                              <div className="oh-policy-title">{policy.title}</div>
                              <div className="oh-policy-desc">
                                {stripHtmlTags(policy.body).substring(0, 100)}
                                {stripHtmlTags(policy.body).length > 100 && '...'}
                              </div>
                            </div>
                          </td>
                          <td>{getStatusBadge(policy.is_active)}</td>
                          <td>{getVisibilityBadge(policy.is_visible_to_all)}</td>
                          <td>{formatDate(policy.created_at)}</td>
                          <td>
                            <div className="oh-actions">
                              <button 
                                className="oh-btn oh-btn--sm oh-btn--ghost"
                                onClick={() => setViewingPolicy(policy)}
                              >
                                View
                              </button>
                              <button 
                                className="oh-btn oh-btn--sm oh-btn--primary"
                                onClick={() => setEditingPolicy(policy)}
                              >
                                Edit
                              </button>
                              <button 
                                className="oh-btn oh-btn--sm oh-btn--danger"
                                onClick={() => handleDeletePolicy(policy.id)}
                                disabled={isLoading}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredPolicies.length === 0 && !isLoading && (
                <div className="oh-empty-state">
                  <div className="oh-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <h3 className="oh-empty-state__title">No policies found</h3>
                  <p className="oh-empty-state__message">
                    No policies match your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Policy Modal */}
      {showCreateModal && (
        <div className="oh-modal-overlay">
          <div className="oh-modal oh-modal--lg">
            <div className="oh-modal-header">
              <h3>Create New Policy</h3>
              <button 
                className="oh-modal-close"
                onClick={() => setShowCreateModal(false)}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="oh-modal-body">
              <form onSubmit={handleCreatePolicy}>
                <div className="oh-form-grid">
                  {/* Policy Title */}
                  <div className="oh-form-group oh-form-group--full">
                    <label htmlFor="title" className="oh-form-label">
                      Policy Title <span className="oh-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={createForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      required
                      className="oh-form-input"
                      placeholder="Enter a clear and descriptive policy title"
                    />
                    {error && !createForm.title && (
                      <div className="oh-form-error">
                        <svg className="oh-form-error-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Policy title is required
                      </div>
                    )}
                    <div className="oh-form-help">
                      Choose a clear, descriptive title that employees can easily understand
                    </div>
                  </div>

                  {/* Policy Content */}
                  <div className="oh-form-group oh-form-group--full">
                    <label htmlFor="body" className="oh-form-label">
                      Policy Content <span className="oh-required">*</span>
                    </label>
                    <textarea
                      id="body"
                      name="body"
                      value={createForm.body}
                      onChange={(e) => handleFormChange('body', e.target.value)}
                      required
                      className="oh-form-textarea"
                      rows={8}
                      placeholder="Enter the detailed policy content. You can use HTML formatting if needed."
                    />
                    {error && !createForm.body && (
                      <div className="oh-form-error">
                        <svg className="oh-form-error-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Policy content is required
                      </div>
                    )}
                    <div className="oh-form-help">
                      Provide comprehensive policy details. HTML formatting is supported for better presentation.
                    </div>
                  </div>

                  {/* Visibility Settings */}
                  <div className="oh-form-group oh-form-group--full">
                    <label className="oh-form-label">Visibility Settings</label>
                    <label className="oh-checkbox">
                      <input
                        type="checkbox"
                        name="is_visible_to_all"
                        checked={createForm.is_visible_to_all}
                        onChange={(e) => handleFormChange('is_visible_to_all', e.target.checked)}
                      />
                      Make this policy visible to all employees
                    </label>
                    <div className="oh-form-help">
                      When enabled, all employees in the organization will be able to view this policy
                    </div>
                  </div>

                  {/* Specific Employees */}
                  {!createForm.is_visible_to_all && (
                    <div className="oh-form-group oh-form-group--full">
                      <label htmlFor="specific_employees" className="oh-form-label">
                        Specific Employees
                      </label>
                      <input
                        type="text"
                        id="specific_employees"
                        name="specific_employees"
                        value={createForm.specific_employees.join(', ')}
                        onChange={(e) => {
                          const value = e.target.value;
                          const employeeIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                          handleFormChange('specific_employees', employeeIds);
                        }}
                        className="oh-form-input"
                        placeholder="Enter employee IDs separated by commas (e.g., 1, 2, 3)"
                      />
                      <div className="oh-form-help">
                        Enter the employee IDs who should have access to this policy, separated by commas
                      </div>
                    </div>
                  )}

                  {/* File Attachments */}
                  <div className="oh-form-group oh-form-group--full">
                    <label className="oh-form-label">
                      Policy Attachments
                    </label>
                    <div className="oh-file-upload">
                      <div className="oh-file-upload-area">
                        <svg className="oh-file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="oh-file-upload-text">
                          Click to upload files or drag and drop
                        </div>
                        <div className="oh-file-upload-hint">
                          PDF, DOC, DOCX, XLS, XLSX files up to 10MB each
                        </div>
                      </div>
                      <input
                        type="text"
                        id="attachments"
                        name="attachments"
                        value={createForm.attachments.join(', ')}
                        onChange={(e) => {
                          const value = e.target.value;
                          const attachmentIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                          handleFormChange('attachments', attachmentIds);
                        }}
                        className="oh-form-input"
                        placeholder="Enter attachment IDs separated by commas (temporary field)"
                        style={{ marginTop: '12px' }}
                      />
                    </div>
                    <div className="oh-form-help">
                      Upload supporting documents, forms, or additional resources related to this policy
                    </div>
                  </div>

                  {/* Company Assignment */}
                  <div className="oh-form-group oh-form-group--full">
                    <label htmlFor="company_id" className="oh-form-label">
                      Company Assignment
                    </label>
                    <input
                      type="text"
                      id="company_id"
                      name="company_id"
                      value={createForm.company_id.join(', ')}
                      onChange={(e) => {
                        const value = e.target.value;
                        const companyIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                        handleFormChange('company_id', companyIds);
                      }}
                      className="oh-form-input"
                      placeholder="Enter company IDs separated by commas (e.g., 1, 2, 3)"
                    />
                    <div className="oh-form-help">
                      Specify which companies this policy applies to. Leave empty to apply to all companies.
                    </div>
                  </div>
                </div>

                {/* General Error Message */}
                {error && (
                  <div className="oh-form-error" style={{ marginTop: '20px', fontSize: '14px' }}>
                    <svg className="oh-form-error-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}
              </form>
            </div>
            <div className="oh-modal-footer">
              <button 
                type="button"
                className="oh-btn oh-btn--secondary"
                onClick={() => {
                  setShowCreateModal(false);
                  setError(null);
                  resetForm();
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="oh-btn oh-btn--primary"
                onClick={handleCreatePolicy}
                disabled={isLoading || !createForm.title || !createForm.body}
              >
                {isLoading ? (
                  <>
                    <div className="oh-spinner"></div>
                    Creating Policy...
                  </>
                ) : (
                  'Create Policy'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Policy Modal */}
      {editingPolicy && (
        <div className="oh-modal-overlay">
          <div className="oh-modal oh-modal--lg">
            <div className="oh-modal-header">
              <h3>Edit Policy</h3>
              <button 
                className="oh-modal-close"
                onClick={() => setEditingPolicy(null)}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="oh-modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePolicy(editingPolicy.id, {
                  title: editingPolicy.title,
                  body: editingPolicy.body,
                  is_visible_to_all: editingPolicy.is_visible_to_all,
                  specific_employees: editingPolicy.specific_employees,
                  attachments: editingPolicy.attachments,
                  company_id: editingPolicy.company_id
                });
              }}>
                <div className="oh-form-grid">
                  {/* Policy Title */}
                  <div className="oh-form-group oh-form-group--full">
                    <label htmlFor="edit-title" className="oh-form-label">
                      Policy Title <span className="oh-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="edit-title"
                      name="title"
                      value={editingPolicy.title}
                      onChange={(e) => setEditingPolicy({...editingPolicy, title: e.target.value})}
                      required
                      className="oh-form-input"
                      placeholder="Enter a clear and descriptive policy title"
                    />
                    {error && !editingPolicy.title && (
                      <div className="oh-form-error">
                        <svg className="oh-form-error-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Policy title is required
                      </div>
                    )}
                    <div className="oh-form-help">
                      Choose a clear, descriptive title that employees can easily understand
                    </div>
                  </div>

                  {/* Policy Content */}
                  <div className="oh-form-group oh-form-group--full">
                    <label htmlFor="edit-body" className="oh-form-label">
                      Policy Content <span className="oh-required">*</span>
                    </label>
                    <textarea
                      id="edit-body"
                      name="body"
                      value={editingPolicy.body}
                      onChange={(e) => setEditingPolicy({...editingPolicy, body: e.target.value})}
                      required
                      className="oh-form-textarea"
                      rows={8}
                      placeholder="Enter the detailed policy content. You can use HTML formatting if needed."
                    />
                    {error && !editingPolicy.body && (
                      <div className="oh-form-error">
                        <svg className="oh-form-error-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Policy content is required
                      </div>
                    )}
                    <div className="oh-form-help">
                      Provide comprehensive policy details. HTML formatting is supported for better presentation.
                    </div>
                  </div>

                  {/* Visibility Settings */}
                  <div className="oh-form-group oh-form-group--full">
                    <label className="oh-form-label">Visibility Settings</label>
                    <label className="oh-checkbox">
                      <input
                        type="checkbox"
                        name="is_visible_to_all"
                        checked={editingPolicy.is_visible_to_all}
                        onChange={(e) => setEditingPolicy({...editingPolicy, is_visible_to_all: e.target.checked})}
                      />
                      Make this policy visible to all employees
                    </label>
                    <div className="oh-form-help">
                      When enabled, all employees in the organization will be able to view this policy
                    </div>
                  </div>

                  {/* Specific Employees */}
                  {!editingPolicy.is_visible_to_all && (
                    <div className="oh-form-group oh-form-group--full">
                      <label htmlFor="edit-specific-employees" className="oh-form-label">
                        Specific Employees
                      </label>
                      <input
                        type="text"
                        id="edit-specific-employees"
                        name="specific_employees"
                        value={editingPolicy.specific_employees?.join(', ') || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const employeeIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                          setEditingPolicy({...editingPolicy, specific_employees: employeeIds});
                        }}
                        className="oh-form-input"
                        placeholder="Enter employee IDs separated by commas (e.g., 1, 2, 3)"
                      />
                      <div className="oh-form-help">
                        Enter the employee IDs who should have access to this policy, separated by commas
                      </div>
                    </div>
                  )}

                  {/* File Attachments */}
                  <div className="oh-form-group oh-form-group--full">
                    <label className="oh-form-label">
                      Policy Attachments
                    </label>
                    <div className="oh-file-upload">
                      <div className="oh-file-upload-area">
                        <svg className="oh-file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <div className="oh-file-upload-text">
                          Click to upload files or drag and drop
                        </div>
                        <div className="oh-file-upload-hint">
                          PDF, DOC, DOCX, XLS, XLSX files up to 10MB each
                        </div>
                      </div>
                      <input
                        type="text"
                        id="edit-attachments"
                        name="attachments"
                        value={editingPolicy.attachments?.join(', ') || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const attachmentIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                          setEditingPolicy({...editingPolicy, attachments: attachmentIds});
                        }}
                        className="oh-form-input"
                        placeholder="Enter attachment IDs separated by commas (temporary field)"
                        style={{ marginTop: '12px' }}
                      />
                    </div>
                    <div className="oh-form-help">
                      Upload supporting documents, forms, or additional resources related to this policy
                    </div>
                  </div>

                  {/* Company Assignment */}
                  <div className="oh-form-group oh-form-group--full">
                    <label htmlFor="edit-company-id" className="oh-form-label">
                      Company Assignment
                    </label>
                    <input
                      type="text"
                      id="edit-company-id"
                      name="company_id"
                      value={editingPolicy.company_id?.join(', ') || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const companyIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                        setEditingPolicy({...editingPolicy, company_id: companyIds});
                      }}
                      className="oh-form-input"
                      placeholder="Enter company IDs separated by commas (e.g., 1, 2, 3)"
                    />
                    <div className="oh-form-help">
                      Specify which companies this policy applies to. Leave empty to apply to all companies.
                    </div>
                  </div>
                </div>

                {/* General Error Message */}
                {error && (
                  <div className="oh-form-error" style={{ marginTop: '20px', fontSize: '14px' }}>
                    <svg className="oh-form-error-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </div>
                )}
              </form>
            </div>
            <div className="oh-modal-footer">
              <button 
                type="button"
                className="oh-btn oh-btn--secondary"
                onClick={() => {
                  setEditingPolicy(null);
                  setError(null);
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="oh-btn oh-btn--primary"
                onClick={() => handleUpdatePolicy(editingPolicy.id, {
                  title: editingPolicy.title,
                  body: editingPolicy.body,
                  is_visible_to_all: editingPolicy.is_visible_to_all,
                  specific_employees: editingPolicy.specific_employees,
                  attachments: editingPolicy.attachments,
                  company_id: editingPolicy.company_id
                })}
                disabled={isLoading || !editingPolicy.title || !editingPolicy.body}
              >
                {isLoading ? (
                  <>
                    <div className="oh-spinner"></div>
                    Updating Policy...
                  </>
                ) : (
                  'Update Policy'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Policy Modal */}
      {viewingPolicy && (
        <div className="oh-modal-overlay">
          <div className="oh-modal oh-modal--xl oh-policy-modal">
            <div className="oh-modal-header oh-policy-modal-header">
              <div className="oh-policy-header-content">
                <div className="oh-policy-header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <div className="oh-policy-header-text">
                  <h3 className="oh-policy-modal-title">Policy Details</h3>
                  <p className="oh-policy-modal-subtitle">Complete policy information and content</p>
                </div>
              </div>
              <button 
                className="oh-modal-close"
                onClick={() => setViewingPolicy(null)}
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="oh-modal-body oh-policy-modal-body">
              <div className="oh-policy-view">
                {/* Policy Title & Status Bar */}
                <div className="oh-policy-title-section">
                  <h1 className="oh-policy-main-title">{viewingPolicy.title}</h1>
                  <div className="oh-policy-status-bar">
                    <div className="oh-policy-status-item">
                      <span className="oh-policy-status-label">Status</span>
                      {getStatusBadge(viewingPolicy.is_active)}
                    </div>
                    <div className="oh-policy-status-item">
                      <span className="oh-policy-status-label">Visibility</span>
                      {getVisibilityBadge(viewingPolicy.is_visible_to_all)}
                    </div>
                    <div className="oh-policy-status-item">
                      <span className="oh-policy-status-label">Created</span>
                      <span className="oh-policy-status-value">{formatDate(viewingPolicy.created_at)}</span>
                    </div>
                    <div className="oh-policy-status-item">
                      <span className="oh-policy-status-label">Policy ID</span>
                      <span className="oh-policy-status-value">#{viewingPolicy.id}</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="oh-policy-content-wrapper">
                  {/* Policy Content */}
                  <div className="oh-policy-main-section">
                    <div className="oh-policy-section-header">
                      <div className="oh-policy-section-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14,2 14,8 20,8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                        </svg>
                      </div>
                      <h2 className="oh-policy-section-title">Policy Content</h2>
                    </div>
                    <div className="oh-policy-content-box">
                      {viewingPolicy.body.includes('<') ? (
                        <div className="oh-policy-html-content" dangerouslySetInnerHTML={{ __html: viewingPolicy.body }} />
                      ) : (
                        <div className="oh-policy-text-content">
                          {viewingPolicy.body.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index} className="oh-policy-paragraph">{paragraph}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Information */}
                  <div className="oh-policy-sidebar">
                    {/* Access & Visibility */}
                    <div className="oh-policy-info-card">
                      <div className="oh-policy-card-header">
                        <div className="oh-policy-card-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </div>
                        <h3 className="oh-policy-card-title">Access & Visibility</h3>
                      </div>
                      <div className="oh-policy-card-content">
                        <div className="oh-policy-info-row">
                          <span className="oh-policy-info-label">Visible to all employees</span>
                          <span className={`oh-policy-info-badge ${viewingPolicy.is_visible_to_all ? 'oh-badge-success' : 'oh-badge-warning'}`}>
                            {viewingPolicy.is_visible_to_all ? 'Yes' : 'No'}
                          </span>
                        </div>
                        
                        {!viewingPolicy.is_visible_to_all && viewingPolicy.specific_employees && viewingPolicy.specific_employees.length > 0 && (
                          <div className="oh-policy-info-row">
                            <span className="oh-policy-info-label">Specific employees</span>
                            <span className="oh-policy-info-value">{viewingPolicy.specific_employees.join(', ')}</span>
                          </div>
                        )}
                        
                        {viewingPolicy.company_id && viewingPolicy.company_id.length > 0 && (
                          <div className="oh-policy-info-row">
                            <span className="oh-policy-info-label">Company IDs</span>
                            <span className="oh-policy-info-value">{viewingPolicy.company_id.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Attachments */}
                    {viewingPolicy.attachments && viewingPolicy.attachments.length > 0 && (
                      <div className="oh-policy-info-card">
                        <div className="oh-policy-card-header">
                          <div className="oh-policy-card-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          </div>
                          <h3 className="oh-policy-card-title">Attachments</h3>
                        </div>
                        <div className="oh-policy-card-content">
                          {viewingPolicy.attachments.map((attachment, index) => (
                            <div key={index} className="oh-policy-attachment-item">
                              <svg className="oh-policy-attachment-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <span className="oh-policy-attachment-name">Attachment {index + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Policy Information */}
                    <div className="oh-policy-info-card">
                      <div className="oh-policy-card-header">
                        <div className="oh-policy-card-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
                          </svg>
                        </div>
                        <h3 className="oh-policy-card-title">Policy Information</h3>
                      </div>
                      <div className="oh-policy-card-content">
                        <div className="oh-policy-info-row">
                          <span className="oh-policy-info-label">Created by</span>
                          <span className="oh-policy-info-value">User ID: {viewingPolicy.created_by}</span>
                        </div>
                        <div className="oh-policy-info-row">
                          <span className="oh-policy-info-label">Last modified by</span>
                          <span className="oh-policy-info-value">User ID: {viewingPolicy.modified_by}</span>
                        </div>
                        <div className="oh-policy-info-row">
                          <span className="oh-policy-info-label">Current status</span>
                          <span className={`oh-policy-info-badge ${viewingPolicy.is_active ? 'oh-badge-success' : 'oh-badge-inactive'}`}>
                            {viewingPolicy.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="oh-modal-footer oh-policy-modal-footer">
              <div className="oh-policy-footer-actions">
                <button 
                  type="button"
                  className="oh-btn oh-btn--secondary oh-btn--large"
                  onClick={() => setViewingPolicy(null)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Close
                </button>
                <button 
                  type="button"
                  className="oh-btn oh-btn--primary oh-btn--large"
                  onClick={() => {
                    setViewingPolicy(null);
                    setEditingPolicy(viewingPolicy);
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <QuickAccess />
    </div>
  );
};

export default Policies;
