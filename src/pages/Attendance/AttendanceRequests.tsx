import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import { useApi } from '../../hooks/useApi';
import { apiClient, endpoints } from '../../utils/api';
import './AttendanceRequests.css';
import AttendanceRequestModal from '../../components/QuickAccess/modals/AttendanceRequestModal';
import WorkRecordFilterWorkInfo from './modals/WorkRecordFilterWorkInfo';
import WorkRecordFilterEmployee from './modals/WorkRecordFilterEmployee';
import WorkRecordFilterAdvance from './modals/WorkRecordFilterAdvance';

interface AttendanceRequest {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  badge_id: string | null;
  employee_profile_url: string | null;
  is_active?: boolean;
  attendance_date: string;
  attendance_clock_in_date: string | null;
  attendance_clock_in: string | null;
  attendance_clock_out_date: string | null;
  attendance_clock_out: string | null;
  attendance_worked_hour: string | null;
  minimum_hour: string;
  at_work_second: number | null;
  overtime_second: number | null;
  is_bulk_request?: boolean;
  request_description: string | null;
  is_holiday?: boolean;
  requested_data: string | null;
  created_by: number | null;
  modified_by: number | null;
  employee_id: number;
  shift_id: number;
  work_type_id: number;
  attendance_day: number | null;
  batch_attendance_id: number | null;
  shift_name?: string;
  // Additional fields for enhanced grouping
  department?: string;
  job_position?: string;
  company?: string;
  reporting_manager?: string;
  employee_type?: string;
  country?: string;
  batch_title?: string;
  work_type?: string;
}

interface AttendanceRequestResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AttendanceRequest[];
}

const AttendanceRequests: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [showModal, setShowModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'workinfo' | 'employee' | 'advance'>('workinfo');
  const [editingRequest, setEditingRequest] = useState<AttendanceRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('requested');
  const [actionLoading, setActionLoading] = useState<{ [key: number | string]: string }>({});
  const [updating, setUpdating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  // Fetch attendance requests from API
  const { data: requestsData, loading, error, refetch } = useApi<AttendanceRequestResponse>(endpoints.attendance.requests.list);

  const attendanceRequests = useMemo(() => {
    console.log('=== ATTENDANCE REQUESTS DEBUG ===');
    console.log('Raw API Response:', requestsData);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
    console.log('Auth token from localStorage:', localStorage.getItem('authToken'));
    console.log('Access token from localStorage:', localStorage.getItem('access'));
    console.log('User data from localStorage:', localStorage.getItem('userData'));
    
    // Test API call directly
    const testApiCall = async () => {
      try {
        const token = localStorage.getItem('access');
        console.log('Making direct API call with token:', token);
        const response = await fetch('/api/v1/attendance/attendance-request/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Direct API response status:', response.status);
        const data = await response.json();
        console.log('Direct API response data:', data);
      } catch (err) {
        console.error('Direct API call error:', err);
      }
    };
    testApiCall();
    
    if (!requestsData?.results) {
      console.log('No results in requestsData');
      return [];
    }
    
    console.log('Number of requests found:', requestsData.results.length);
    return requestsData.results;
  }, [requestsData, loading, error]);

  // Helper function to determine status based on validation fields
  const getRequestStatus = (request: AttendanceRequest): 'pending' | 'approved' | 'rejected' => {
    // Based on the backend model, attendance requests that have is_validate_request=true are pending validation
    // Since all records in the API response are attendance requests (is_validate_request=true),
    // we'll treat them as pending for now. In a real scenario, you'd need additional fields
    // to determine approved/rejected status
    return 'pending';
  };

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    let filtered = attendanceRequests;

    // Filter by tab (status)
    if (activeTab === 'requested') {
      filtered = filtered.filter(request => getRequestStatus(request) === 'pending');
    }
    // For 'all' tab, we don't filter by status - show all records

    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        `${request.employee_first_name} ${request.employee_last_name}`.toLowerCase().includes(searchLower) ||
        (request.badge_id && request.badge_id.toLowerCase().includes(searchLower)) ||
        (request.shift_name && request.shift_name.toLowerCase().includes(searchLower)) ||
        request.attendance_date.includes(searchTerm) ||
        (request.request_description && request.request_description.toLowerCase().includes(searchLower))
      );
    }

    // Additional filters
    if (filterBy === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(request => request.attendance_date === today);
    } else if (filterBy === 'this_week') {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      filtered = filtered.filter(request => new Date(request.attendance_date) >= weekStart);
    } else if (filterBy === 'this_month') {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      filtered = filtered.filter(request => new Date(request.attendance_date) >= monthStart);
    } else if (filterBy === 'overtime') {
      filtered = filtered.filter(request => request.overtime_second !== null && request.overtime_second > 0);
    }

    return filtered;
  }, [attendanceRequests, activeTab, searchTerm, filterBy]);

  // Group records logic
  const groupedRequests = useMemo(() => {
    if (groupBy === 'none') {
      return { 'All Records': filteredRequests };
    }

    const grouped: { [key: string]: AttendanceRequest[] } = {};

    filteredRequests.forEach(request => {
      let groupKey = '';
      
      switch (groupBy) {
        case 'employee':
          groupKey = `${request.employee_first_name} ${request.employee_last_name}`;
          break;
        case 'batch':
          groupKey = request.batch_title || 'No Batch';
          break;
        case 'attendance_date':
          groupKey = request.attendance_date;
          break;
        case 'shift':
          groupKey = request.shift_name || 'No Shift';
          break;
        case 'work_type':
          groupKey = request.work_type || 'No Work Type';
          break;
        case 'minimum_hour':
          groupKey = `${request.minimum_hour} hours`;
          break;
        case 'country':
          groupKey = request.country || 'No Country';
          break;
        case 'reporting_manager':
          groupKey = request.reporting_manager || 'No Manager';
          break;
        case 'department':
          groupKey = request.department || 'No Department';
          break;
        case 'job_position':
          groupKey = request.job_position || 'No Position';
          break;
        case 'employment_type':
          groupKey = request.employee_type || 'No Employment Type';
          break;
        case 'company':
          groupKey = request.company || 'No Company';
          break;
        case 'status':
          const status = getRequestStatus(request);
          groupKey = status.charAt(0).toUpperCase() + status.slice(1);
          break;
        default:
          groupKey = 'All Records';
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(request);
    });

    return grouped;
  }, [filteredRequests, groupBy]);

  const handleSelectAll = () => {
    if (selectedRequests.length === filteredRequests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(filteredRequests.map(request => request.id).filter((id): id is number => id !== undefined));
    }
  };

  const handleSelectRequest = (requestId: number) => {
    setSelectedRequests(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  // Function to create new attendance request
  const handleCreateAttendanceRequest = async (requestData: {
    employee_id: number;
    attendance_date: string;
    shift_id: number;
    work_type_id: number;
    minimum_hour: string;
    request_description?: string;
    attendance_clock_in_date?: string;
    attendance_clock_in?: string;
    attendance_clock_out_date?: string;
    attendance_clock_out?: string;
    attendance_worked_hour?: string;
    batch_attendance_id?: string;
  }) => {
    try {
       const response = await apiClient.post(endpoints.attendance.requests.create, requestData) as any;
       console.log('Attendance request created successfully:', response);
       await refetch(); // Refresh the data
       return response;
     } catch (error) {
      console.error('Error creating attendance request:', error);
      throw error;
    }
  };

  // Function to handle edit request
  const handleEditRequest = (request: AttendanceRequest) => {
    setEditingRequest(request);
    setShowModal(true);
  };

  // API action handlers
  const handleApproveRequest = async (requestId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'approving' }));
      // Note: Using the attendance-request PUT endpoint to update the request
      const request = attendanceRequests.find(r => r.id === requestId);
      if (request) {
        await apiClient.put(endpoints.attendance.requests.update(requestId.toString()), {
          ...request,
          // Add any approval-specific fields here
        });
      }
      await refetch(); // Refresh the data
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'rejecting' }));
      // Note: Using the attendance-request PUT endpoint to update the request
      const request = attendanceRequests.find(r => r.id === requestId);
      if (request) {
        await apiClient.put(endpoints.attendance.requests.update(requestId.toString()), {
          ...request,
          // Add any rejection-specific fields here
        });
      }
      await refetch(); // Refresh the data
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    }
  };

  const handleApproveOvertime = async (requestId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'approving_overtime' }));
      // Note: Using the attendance-request PUT endpoint to update overtime approval
      const request = attendanceRequests.find(r => r.id === requestId);
      if (request) {
        await apiClient.put(endpoints.attendance.requests.update(requestId.toString()), {
          ...request,
          // Add overtime approval specific fields here
        });
      }
      await refetch(); // Refresh the data
    } catch (error) {
      console.error('Error approving overtime:', error);
      alert('Failed to approve overtime. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[requestId];
        return newState;
      });
    }
  };

  const handleBulkApprove = async () => {
    if (selectedRequests.length === 0) return;
    
    try {
      setActionLoading(prev => ({ ...prev, bulk: 'approving' }));
      await Promise.all(
        selectedRequests.map(id => {
          const request = attendanceRequests.find(r => r.id === id);
          if (request) {
            return apiClient.put(endpoints.attendance.requests.update(id.toString()), {
              ...request,
              // Add approval-specific fields here
            });
          }
          return Promise.resolve();
        })
      );
      setSelectedRequests([]);
      await refetch();
    } catch (error) {
      console.error('Error bulk approving requests:', error);
      alert('Failed to approve some requests. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState.bulk;
        return newState;
      });
    }
  };

  // Handle add to batch functionality
  const handleAddToBatch = async () => {
    if (selectedRequests.length === 0) {
      alert('Please select attendance requests to add to batch.');
      return;
    }

    const batchTitle = prompt('Enter batch title:');
    if (!batchTitle) return;

    try {
      setUpdating(true);
      // Create batch first
      const batchResponse = await apiClient.post('/api/v1/attendance/batch-attendance/', {
        title: batchTitle,
        description: `Batch created with ${selectedRequests.length} attendance requests`
      });

      const batchId = (batchResponse as any).data.id;

      // Update selected requests with batch ID
      const updatePromises = selectedRequests.map(requestId => 
        apiClient.put(`/api/v1/attendance/attendance-request/${requestId}`, {
          batch_attendance_id: batchId
        })
      );

      await Promise.all(updatePromises);
      
      setSelectedRequests([]);
      refetch();
      alert(`Successfully added ${selectedRequests.length} requests to batch "${batchTitle}"`);
    } catch (error) {
      console.error('Failed to add requests to batch:', error);
      alert('Failed to add requests to batch. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle view batches functionality
  const handleViewBatches = async () => {
    try {
      const response = await apiClient.get('/api/v1/attendance/batch-attendance/');
      const batches = (response as any).data.results || [];
      
      if (batches.length === 0) {
        alert('No batches found.');
        return;
      }

      // Create a simple modal to display batches
      const batchList = batches.map((batch: any) => 
        `${batch.title} (ID: ${batch.id}) - ${batch.description || 'No description'}`
      ).join('\n');
      
      alert(`Available Batches:\n\n${batchList}`);
    } catch (error) {
      console.error('Failed to fetch batches:', error);
      alert('Failed to fetch batches. Please try again.');
    }
  };

  const handleBulkReject = async () => {
    if (selectedRequests.length === 0) return;
    
    try {
      setActionLoading(prev => ({ ...prev, bulk: 'rejecting' }));
      await Promise.all(
        selectedRequests.map(id => {
          const request = attendanceRequests.find(r => r.id === id);
          if (request) {
            return apiClient.put(endpoints.attendance.requests.update(id.toString()), {
              ...request,
              // Add rejection-specific fields here
            });
          }
          return Promise.resolve();
        })
      );
      setSelectedRequests([]);
      await refetch();
    } catch (error) {
      console.error('Error bulk rejecting requests:', error);
      alert('Failed to reject some requests. Please try again.');
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState.bulk;
        return newState;
      });
    }
  };

  return (
    <div className="attendance-requests-page">
      <Sidebar />
      <div className={`areq-main-content ${isCollapsed ? 'areq-main-content--collapsed' : ''}`}>
        <div className={`areq-navbar ${isCollapsed ? 'areq-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="areq-content">
          <div className="areq-content-container">
            {/* Page Header */}
            <div className="areq-header">
              <div className="areq-header__left">
                <h1 className="areq-header__title">Attendance Requests</h1>
              </div>
              <div className="areq-header__actions">
                <button
                  className="areq-btn areq-btn--primary"
                  onClick={() => setShowModal(true)}
                >
                  + Create
                </button>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="areq-tabs">
              <button
                className={`areq-tab ${activeTab === 'requested' ? 'areq-tab--active' : ''}`}
                onClick={() => setActiveTab('requested')}
              >
                Requested Attendances
                <span className="areq-tab__count">
                  {attendanceRequests.filter(r => getRequestStatus(r) === 'pending').length}
                </span>
              </button>
              <button
                className={`areq-tab ${activeTab === 'all' ? 'areq-tab--active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Attendances
                <span className="areq-tab__count">
                  {attendanceRequests.length}
                </span>
              </button>
            </div>

            {/* Search, Filter, and Group Controls */}
            <div className="areq-controls">
              <div className="areq-search">
                <input
                  type="text"
                  placeholder="Search by employee, shift, work type, date, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="areq-search__input"
                />
              </div>
              <div className="areq-filters">
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="areq-filter__button"
                >
                  Filter
                </button>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="areq-group__select"
                >
                  <option value="none">Select</option>
                  <option value="employee">Employee</option>
                  <option value="batch">Batch</option>
                  <option value="attendance_date">Attendance Date</option>
                  <option value="shift">Shift</option>
                  <option value="work_type">Work Type</option>
                  <option value="minimum_hour">Minimum Hour</option>
                  <option value="country">Country</option>
                  <option value="reporting_manager">Reporting Manager</option>
                  <option value="department">Department</option>
                  <option value="job_position">Job Position</option>
                  <option value="employment_type">Employment Type</option>
                  <option value="company">Company</option>
                </select>
                
                {/* Actions Dropdown */}
                <div className="areq-actions-dropdown">
                  <select
                    onChange={(e) => {
                      const action = e.target.value;
                      if (action === 'add_to_batch') {
                        handleAddToBatch();
                      } else if (action === 'view_batches') {
                        handleViewBatches();
                      } else if (action === 'bulk_approve') {
                        handleBulkApprove();
                      } else if (action === 'bulk_reject') {
                        handleBulkReject();
                      }
                      e.target.value = ''; // Reset selection
                    }}
                    className="areq-actions__select"
                    disabled={updating || approving || rejecting}
                  >
                    <option value="">Actions</option>
                    <option value="add_to_batch" disabled={selectedRequests.length === 0}>
                      Add to Batch
                    </option>
                    <option value="view_batches">Batches</option>
                    <option value="bulk_approve" disabled={selectedRequests.length === 0}>
                      Bulk Approve
                    </option>
                    <option value="bulk_reject" disabled={selectedRequests.length === 0}>
                      Bulk Reject
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="areq-card">
              {loading ? (
                <div className="areq-loading">
                  <div className="areq-loading__spinner"></div>
                  <p>Loading attendance requests...</p>
                </div>
              ) : error ? (
                <div className="areq-error">
                  <div className="areq-error__icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <h3>Error Loading Data</h3>
                  <p>{error}</p>
                  <button onClick={refetch} className="areq-btn areq-btn--secondary">
                    Try Again
                  </button>
                </div>
              ) : Object.values(groupedRequests).flat().length === 0 ? (
                <div className="areq-card__content">
                  <div className="areq-empty-state">
                    <div className="areq-empty-state__icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                      </svg>
                    </div>
                    <h2 className="areq-empty-state__title">No Records found.</h2>
                    <p className="areq-empty-state__message">
                      There are no attendance requests to display.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Bulk Actions */}
                  {selectedRequests.length > 0 && (
                    <div className="areq-bulk-actions">
                      <span className="areq-bulk-actions__count">
                        {selectedRequests.length} selected
                      </span>
                      <div className="areq-bulk-actions__buttons">
                        <button 
                          className="areq-btn areq-btn--secondary"
                          onClick={handleBulkApprove}
                          disabled={actionLoading.bulk === 'approving'}
                        >
                          {actionLoading.bulk === 'approving' ? 'Approving...' : 'Approve Selected'}
                        </button>
                        <button 
                          className="areq-btn areq-btn--secondary"
                          onClick={handleBulkReject}
                          disabled={actionLoading.bulk === 'rejecting'}
                        >
                          {actionLoading.bulk === 'rejecting' ? 'Rejecting...' : 'Reject Selected'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Table */}
                  <div className="areq-table-container areq-table-container--compact">
                    <table className="areq-table areq-table--compact">
                      <thead>
                        <tr>
                          <th className="areq-th--checkbox">
                            <input
                              type="checkbox"
                              checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th className="areq-th--employee">Employee</th>
                          <th className="areq-th--date">Date</th>
                          <th className="areq-th--shift">Shift</th>
                          <th className="areq-th--time">Clock In/Out</th>
                          <th className="areq-th--hours">Hours</th>
                          <th className="areq-th--overtime">OT</th>
                          <th className="areq-th--status">Status</th>
                          <th className="areq-th--reason">Reason</th>
                          <th className="areq-th--actions">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(groupedRequests).map(([groupName, requests]) => (
                          <React.Fragment key={groupName}>
                            {groupBy !== 'none' && (
                              <tr className="areq-group-header">
                                <td colSpan={10}>
                                  <strong>{groupName}</strong> ({requests.length} records)
                                </td>
                              </tr>
                            )}
                            {requests.map((request) => (
                              <tr key={request.id} className="areq-table-row">
                                <td className="areq-td--checkbox">
                                  <input
                                    type="checkbox"
                                    checked={request.id ? selectedRequests.includes(request.id) : false}
                                    onChange={() => request.id && handleSelectRequest(request.id)}
                                  />
                                </td>
                                <td className="areq-td--employee">
                                  <div className="areq-employee areq-employee--compact">
                                    <div className="areq-employee__name">
                                      {request.employee_first_name} {request.employee_last_name}
                                    </div>
                                    <div className="areq-employee__badge">
                                      {request.badge_id || '-'}
                                    </div>
                                  </div>
                                </td>
                                <td className="areq-td--date">{new Date(request.attendance_date).toLocaleDateString()}</td>
                                <td className="areq-td--shift">{request.shift_name || '-'}</td>
                                <td className="areq-td--time">
                                  <div className="areq-time-range">
                                    <span>{request.attendance_clock_in || '-'}</span>
                                    <span>-</span>
                                    <span>{request.attendance_clock_out || '-'}</span>
                                  </div>
                                </td>
                                <td className="areq-td--hours">{request.attendance_worked_hour || '-'}</td>
                                <td className="areq-td--overtime">{request.overtime_second && request.overtime_second > 0 ? `${Math.floor(request.overtime_second / 3600)}:${Math.floor((request.overtime_second % 3600) / 60).toString().padStart(2, '0')}` : '0:00'}</td>
                                <td className="areq-td--status">
                                  <span className={`areq-status areq-status--${getRequestStatus(request)} areq-status--compact`}>
                                    {getRequestStatus(request).charAt(0).toUpperCase() + getRequestStatus(request).slice(1)}
                                  </span>
                                </td>
                                <td className="areq-td--reason">
                                  <div className="areq-reason areq-reason--compact" title={request.request_description || ''}>
                                    {request.request_description ? (request.request_description.length > 20 ? `${request.request_description.substring(0, 20)}...` : request.request_description) : '-'}
                                  </div>
                                </td>
                                <td className="areq-td--actions">
                                  <div className="areq-actions areq-actions--compact">
                                    {getRequestStatus(request) === 'pending' && (
                                      <>
                                        <button 
                                          className="areq-action-btn areq-action-btn--edit" 
                                          title="Edit"
                                          onClick={() => handleEditRequest(request)}
                                        >
                                          ✏️
                                        </button>
                                        <button 
                                          className="areq-action-btn areq-action-btn--reject" 
                                          title="Reject"
                                          onClick={() => request.id && handleRejectRequest(request.id)}
                                          disabled={request.id ? actionLoading[request.id] === 'rejecting' : true}
                                        >
                                          {actionLoading[request.id] === 'rejecting' ? '⏳' : '✗'}
                                        </button>
                                        {request.overtime_second !== null && request.overtime_second > 0 && (
                                          <button 
                                            className="areq-action-btn areq-action-btn--overtime" 
                                            title="Approve Overtime"
                                            onClick={() => request.id && handleApproveOvertime(request.id)}
                                            disabled={request.id ? actionLoading[request.id] === 'approving_overtime' : true}
                                          >
                                            {actionLoading[request.id] === 'approving_overtime' ? '⏳' : '⏰'}
                                          </button>
                                        )}
                                      </>
                                    )}
                                    <button className="areq-action-btn areq-action-btn--view" title="View Details">
                                      👁
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <QuickAccess />
        {/* Attendance Request Modal */}
        {showModal && (
          <div className="areq-modal-overlay">
            <div className="areq-modal">
              <AttendanceRequestModal 
                isOpen={showModal} 
                onClose={() => {
                  setShowModal(false);
                  setEditingRequest(null);
                }}
                onRefresh={refetch}
                onSuccess={(message) => {
                  console.log('Attendance request result:', message);
                  // You can add a toast notification here if needed
                }}
                editingRequest={editingRequest}
              />
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="areq-modal-overlay" onClick={() => setShowFilterModal(false)}>
            <div className="areq-modal" onClick={(e) => e.stopPropagation()}>
              <div className="areq-modal__header">
                <h3>Filter Attendance Requests</h3>
                <button 
                  className="areq-modal__close"
                  onClick={() => setShowFilterModal(false)}
                >
                  ×
                </button>
              </div>
              <div className="areq-modal__content">
                <div className="areq-filter-section">
                  <h4>Time Period</h4>
                  <div className="areq-filter-options">
                    <label>
                      <input
                        type="radio"
                        name="timeFilter"
                        value="all"
                        checked={filterBy === 'all'}
                        onChange={(e) => setFilterBy(e.target.value)}
                      />
                      All Records
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="timeFilter"
                        value="today"
                        checked={filterBy === 'today'}
                        onChange={(e) => setFilterBy(e.target.value)}
                      />
                      Today
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="timeFilter"
                        value="this_week"
                        checked={filterBy === 'this_week'}
                        onChange={(e) => setFilterBy(e.target.value)}
                      />
                      This Week
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="timeFilter"
                        value="this_month"
                        checked={filterBy === 'this_month'}
                        onChange={(e) => setFilterBy(e.target.value)}
                      />
                      This Month
                    </label>
                  </div>
                </div>
                
                <div className="areq-filter-section">
                  <h4>Additional Filters</h4>
                  <div className="areq-filter-options">
                    <label>
                      <input
                        type="checkbox"
                        checked={filterBy === 'overtime'}
                        onChange={(e) => setFilterBy(e.target.checked ? 'overtime' : 'all')}
                      />
                      With Overtime
                    </label>
                  </div>
                </div>
              </div>
              <div className="areq-modal__footer">
                <button 
                  className="areq-btn areq-btn--secondary"
                  onClick={() => {
                    setFilterBy('all');
                    setShowFilterModal(false);
                  }}
                >
                  Clear Filters
                </button>
                <button 
                  className="areq-btn areq-btn--primary"
                  onClick={() => setShowFilterModal(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRequests;
