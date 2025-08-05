import React, { useState, useMemo } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Navbar from '../../../components/Layout/Navbar';
import { useSidebar } from '../../../contexts/SidebarContext';
import './Policies.css';

interface Policy {
  id: string;
  title: string;
  description: string;
  category: string;
  version: string;
  status: 'active' | 'draft' | 'archived' | 'under_review';
  effectiveDate: string;
  lastUpdated: string;
  updatedBy: string;
  document: string;
  tags: string[];
  acknowledgmentRequired: boolean;
  acknowledged?: {
    count: number;
    total: number;
    percentage: number;
  };
}

const Policies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    category: '',
    version: '1.0',
    effectiveDate: '',
    document: '',
    tags: '',
    acknowledgmentRequired: false
  });
  const { isCollapsed } = useSidebar();

  // Mock data for policies
  const mockPolicies: Policy[] = [
    {
      id: 'POL-001',
      title: 'Code of Conduct',
      description: 'Guidelines for professional behavior and ethical standards expected from all employees.',
      category: 'HR Policies',
      version: '3.2',
      status: 'active',
      effectiveDate: '2024-01-01',
      lastUpdated: '2023-12-15',
      updatedBy: 'HR Department',
      document: 'code_of_conduct_v3.2.pdf',
      tags: ['ethics', 'behavior', 'mandatory'],
      acknowledgmentRequired: true,
      acknowledged: {
        count: 145,
        total: 150,
        percentage: 96.7
      }
    },
    {
      id: 'POL-002',
      title: 'Remote Work Policy',
      description: 'Guidelines and requirements for employees working remotely, including equipment, security, and productivity standards.',
      category: 'Work Policies',
      version: '2.1',
      status: 'active',
      effectiveDate: '2023-06-01',
      lastUpdated: '2023-05-20',
      updatedBy: 'IT Department',
      document: 'remote_work_policy_v2.1.pdf',
      tags: ['remote', 'work from home', 'IT security'],
      acknowledgmentRequired: true,
      acknowledged: {
        count: 98,
        total: 150,
        percentage: 65.3
      }
    },
    {
      id: 'POL-003',
      title: 'Data Privacy and Security',
      description: 'Comprehensive guidelines for handling, processing, and protecting sensitive company and customer data.',
      category: 'Security Policies',
      version: '4.0',
      status: 'under_review',
      effectiveDate: '2024-02-01',
      lastUpdated: '2024-01-10',
      updatedBy: 'Legal & Compliance',
      document: 'data_privacy_security_v4.0_draft.pdf',
      tags: ['data protection', 'privacy', 'GDPR', 'security'],
      acknowledgmentRequired: true
    },
    {
      id: 'POL-004',
      title: 'Leave and Time Off',
      description: 'Comprehensive policy covering vacation time, sick leave, personal days, and holiday schedules.',
      category: 'HR Policies',
      version: '2.5',
      status: 'active',
      effectiveDate: '2023-01-01',
      lastUpdated: '2022-11-30',
      updatedBy: 'HR Department',
      document: 'leave_policy_v2.5.pdf',
      tags: ['vacation', 'sick leave', 'PTO'],
      acknowledgmentRequired: false
    },
    {
      id: 'POL-005',
      title: 'Expense Reimbursement',
      description: 'Guidelines for business expense reporting, approval processes, and reimbursement procedures.',
      category: 'Finance Policies',
      version: '1.8',
      status: 'draft',
      effectiveDate: '2024-03-01',
      lastUpdated: '2024-01-05',
      updatedBy: 'Finance Department',
      document: 'expense_reimbursement_v1.8_draft.pdf',
      tags: ['expenses', 'reimbursement', 'travel'],
      acknowledgmentRequired: false
    },
    {
      id: 'POL-006',
      title: 'Social Media Guidelines',
      description: 'Rules and best practices for employee use of social media platforms in relation to company business.',
      category: 'Communication Policies',
      version: '1.3',
      status: 'archived',
      effectiveDate: '2022-01-01',
      lastUpdated: '2023-12-31',
      updatedBy: 'Marketing Department',
      document: 'social_media_guidelines_v1.3.pdf',
      tags: ['social media', 'communication', 'brand'],
      acknowledgmentRequired: true,
      acknowledged: {
        count: 150,
        total: 150,
        percentage: 100
      }
    }
  ];

  // Form handling functions
  const handleFormChange = (field: string, value: string | boolean) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePolicy = async () => {
    if (!createForm.title || !createForm.description || !createForm.category || !createForm.effectiveDate) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close modal
      setCreateForm({
        title: '',
        description: '',
        category: '',
        version: '1.0',
        effectiveDate: '',
        document: '',
        tags: '',
        acknowledgmentRequired: false
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating policy:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search logic
  const filteredPolicies = useMemo(() => {
    return mockPolicies.filter(policy => {
      const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || policy.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || policy.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [mockPolicies, searchTerm, categoryFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = mockPolicies.length;
    const active = mockPolicies.filter(p => p.status === 'active').length;
    const draft = mockPolicies.filter(p => p.status === 'draft').length;
    const underReview = mockPolicies.filter(p => p.status === 'under_review').length;
    const archived = mockPolicies.filter(p => p.status === 'archived').length;
    
    return { total, active, draft, underReview, archived };
  }, [mockPolicies]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      active: 'oh-status-badge oh-status-badge--active',
      draft: 'oh-status-badge oh-status-badge--draft',
      under_review: 'oh-status-badge oh-status-badge--review',
      archived: 'oh-status-badge oh-status-badge--archived'
    };
    
    const statusLabels = {
      active: 'Active',
      draft: 'Draft',
      under_review: 'Under Review',
      archived: 'Archived'
    };
    
    return (
      <span className={statusClasses[status as keyof typeof statusClasses]}>
        {statusLabels[status as keyof typeof statusLabels]}
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

  const getAcknowledgmentStatus = (policy: Policy) => {
    if (!policy.acknowledgmentRequired) {
      return <span className="oh-acknowledgment-not-required">Not Required</span>;
    }
    
    if (!policy.acknowledged) {
      return <span className="oh-acknowledgment-pending">Pending Setup</span>;
    }
    
    const { percentage } = policy.acknowledged;
    const statusClass = percentage >= 90 ? 'high' : percentage >= 70 ? 'medium' : 'low';
    
    return (
      <div className={`oh-acknowledgment-status oh-acknowledgment-status--${statusClass}`}>
        <div className="oh-acknowledgment-percentage">{percentage.toFixed(1)}%</div>
        <div className="oh-acknowledgment-count">
          {policy.acknowledged.count} / {policy.acknowledged.total}
        </div>
      </div>
    );
  };

  return (
    <div className="oh-dashboard">
      <Sidebar />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar pageTitle="Policies" />
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
                  <div className="oh-stat-card__value">{stats.total}</div>
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
                  <div className="oh-stat-card__value">{stats.active}</div>
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
                  <div className="oh-stat-card__value">{stats.draft}</div>
                  <div className="oh-stat-card__label">Draft</div>
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
                  <div className="oh-stat-card__value">{stats.underReview}</div>
                  <div className="oh-stat-card__label">Under Review</div>
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
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="HR Policies">HR Policies</option>
                  <option value="Work Policies">Work Policies</option>
                  <option value="Security Policies">Security Policies</option>
                  <option value="Finance Policies">Finance Policies</option>
                  <option value="Communication Policies">Communication Policies</option>
                </select>

                <select 
                  className="oh-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="under_review">Under Review</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Content Area */}
            <div className="oh-content-area">
              <div className="oh-table-container">
                <table className="oh-table">
                  <thead>
                    <tr>
                      <th>Policy</th>
                      <th>Category</th>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Effective Date</th>
                      <th>Acknowledgment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPolicies.map((policy) => (
                      <tr key={policy.id}>
                        <td>
                          <div className="oh-policy-info">
                            <div className="oh-policy-title">{policy.title}</div>
                            <div className="oh-policy-desc">{policy.description}</div>
                            <div className="oh-policy-tags">
                              {policy.tags.map((tag, index) => (
                                <span key={index} className="oh-policy-tag">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="oh-category-badge">{policy.category}</span>
                        </td>
                        <td>
                          <span className="oh-version-badge">v{policy.version}</span>
                        </td>
                        <td>{getStatusBadge(policy.status)}</td>
                        <td>{formatDate(policy.effectiveDate)}</td>
                        <td>{getAcknowledgmentStatus(policy)}</td>
                        <td>
                          <div className="oh-actions">
                            <button className="oh-btn oh-btn--sm oh-btn--ghost">View</button>
                            {policy.status === 'active' && (
                              <button className="oh-btn oh-btn--sm oh-btn--secondary">Download</button>
                            )}
                            {(policy.status === 'draft' || policy.status === 'under_review') && (
                              <button className="oh-btn oh-btn--sm oh-btn--primary">Edit</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredPolicies.length === 0 && (
                <div className="oh-empty-state">
                  <div className="oh-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                  <h3 className="oh-empty-state__title">No policies found</h3>
                  <p className="oh-empty-state__message">
                    There are currently no policies to consider.
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
          <div className="oh-create-rotating-modal">
            <div className="oh-modal-header">
              <h2 className="oh-modal-title">Create New Policy</h2>
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
                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Policy Title <span className="oh-required">*</span></label>
                  <input 
                    type="text"
                    className="oh-form-input"
                    placeholder="Enter policy title"
                    value={createForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Description <span className="oh-required">*</span></label>
                  <textarea 
                    className="oh-form-textarea"
                    rows={3}
                    placeholder="Describe the policy purpose and scope..."
                    value={createForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Category <span className="oh-required">*</span></label>
                  <select 
                    className="oh-form-input"
                    value={createForm.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option value="HR Policies">HR Policies</option>
                    <option value="IT Security">IT Security</option>
                    <option value="Health & Safety">Health & Safety</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Legal & Compliance">Legal & Compliance</option>
                  </select>
                </div>
                
                <div className="oh-form-group">
                  <label className="oh-form-label">Version</label>
                  <input 
                    type="text"
                    className="oh-form-input"
                    placeholder="1.0"
                    value={createForm.version}
                    onChange={(e) => handleFormChange('version', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Effective Date <span className="oh-required">*</span></label>
                  <input 
                    type="date"
                    className="oh-form-input"
                    value={createForm.effectiveDate}
                    onChange={(e) => handleFormChange('effectiveDate', e.target.value)}
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label">Document</label>
                  <input 
                    type="text"
                    className="oh-form-input"
                    placeholder="Document filename or URL"
                    value={createForm.document}
                    onChange={(e) => handleFormChange('document', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-label">Tags</label>
                  <input 
                    type="text"
                    className="oh-form-input"
                    placeholder="Enter tags separated by commas"
                    value={createForm.tags}
                    onChange={(e) => handleFormChange('tags', e.target.value)}
                  />
                </div>

                <div className="oh-form-group oh-form-group--full-width">
                  <label className="oh-form-checkbox">
                    <input 
                      type="checkbox"
                      checked={createForm.acknowledgmentRequired}
                      onChange={(e) => handleFormChange('acknowledgmentRequired', e.target.checked)}
                    />
                    <span className="oh-form-checkbox__checkmark"></span>
                    Acknowledgment required from employees
                  </label>
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
                onClick={handleCreatePolicy}
                disabled={isLoading || !createForm.title || !createForm.description || !createForm.category || !createForm.effectiveDate}
              >
                {isLoading ? (
                  <>
                    <div className="oh-spinner"></div>
                    Creating...
                  </>
                ) : (
                  'Create Policy'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Policies;
