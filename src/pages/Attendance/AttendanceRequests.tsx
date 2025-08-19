import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import { useApi } from '../../hooks/useApi';
import { apiClient, endpoints } from '../../utils/api';
import './AttendanceRequests.css';
import AttendanceRequestModal from '../../components/QuickAccess/modals/AttendanceRequestModal';
<<<<<<< HEAD
// import WorkRecordFilterWorkInfo from './modals/WorkRecordFilterWorkInfo'; // File does not exist
// import WorkRecordFilterEmployee from './modals/WorkRecordFilterEmployee'; // File does not exist
// import WorkRecordFilterAdvance from './modals/WorkRecordFilterAdvance'; // File does not exist
=======
>>>>>>> e40fc566738fdd37d2699ea20f279c110f0d7dbf

interface AttendanceRequest {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  badge_id: string | null;
  employee_profile_url: string;
  is_active: boolean;
  attendance_date: string;
  attendance_clock_in_date: string | null;
  attendance_clock_in: string | null;
  attendance_clock_out_date: string | null;
  attendance_clock_out: string | null;
  attendance_worked_hour: string;
  minimum_hour: string;
  at_work_second: number;
  overtime_second: number;
  is_bulk_request: boolean;
  request_description: string | null;
  is_holiday: boolean;
  requested_data: string | null;
  created_by: number;
  modified_by: number;
  employee_id: number;
  shift_id: number | null;
  work_type_id: number | null;
  attendance_day: number;
  batch_attendance_id: number | null;
  shift_name?: string;
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState<AttendanceRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState<{ [key: number | string]: string }>({});

  // Fetch attendance requests from API
  const { data: requestsData, loading, error, refetch } = useApi<AttendanceRequestResponse>(endpoints.attendance.request.list);

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

  // Function to handle editing an attendance request
  const handleEditRequest = (request: AttendanceRequest) => {
    setEditingRequest(request);
    setShowEditModal(true);
  };

  // Function to close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingRequest(null);
  };

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
    if (activeTab === 'pending') {
      filtered = filtered.filter(request => getRequestStatus(request) === 'pending');
    } else if (activeTab === 'approved') {
      filtered = filtered.filter(request => getRequestStatus(request) === 'approved');
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(request => getRequestStatus(request) === 'rejected');
    }

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
      filtered = filtered.filter(request => request.overtime_second > 0);
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
        case 'shift':
          groupKey = request.shift_name || 'No Shift';
          break;
        case 'work_type':
          groupKey = 'Work Type'; // Since work type name is not directly available
          break;
        case 'date':
          groupKey = request.attendance_date;
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
      setSelectedRequests(filteredRequests.map(request => request.id));
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
       const response = await apiClient.post('/api/v1/attendance/attendance-request/', requestData) as any;
       console.log('Attendance request created successfully:', response.data);
       await refetch(); // Refresh the data
       return response.data;
     } catch (error) {
      console.error('Error creating attendance request:', error);
      throw error;
    }
  };

  // API action handlers
  const handleApproveRequest = async (requestId: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'approving' }));
      await apiClient.put(`/api/v1/attendance/attendance-request-approve/${requestId}`);
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
      await apiClient.put(`/api/v1/attendance/attendance-request-cancel/${requestId}`);
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
      await apiClient.put(`/api/v1/attendance/overtime-approve/${requestId}`);
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
        selectedRequests.map(id => 
          apiClient.put(`/api/v1/attendance/attendance-request-approve/${id}`)
        )
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

  const handleBulkReject = async () => {
    if (selectedRequests.length === 0) return;
    
    try {
      setActionLoading(prev => ({ ...prev, bulk: 'rejecting' }));
      await Promise.all(
        selectedRequests.map(id => 
          apiClient.put(`/api/v1/attendance/attendance-request-cancel/${id}`)
        )
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
                className={`areq-tab ${activeTab === 'pending' ? 'areq-tab--active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending Requests
                <span className="areq-tab__count">
                  {attendanceRequests.filter(r => getRequestStatus(r) === 'pending').length}
                </span>
              </button>
              <button
                className={`areq-tab ${activeTab === 'approved' ? 'areq-tab--active' : ''}`}
                onClick={() => setActiveTab('approved')}
              >
                Approved Requests
                <span className="areq-tab__count">
                  {attendanceRequests.filter(r => getRequestStatus(r) === 'approved').length}
                </span>
              </button>
              <button
                className={`areq-tab ${activeTab === 'rejected' ? 'areq-tab--active' : ''}`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected Requests
                <span className="areq-tab__count">
                  {attendanceRequests.filter(r => getRequestStatus(r) === 'rejected').length}
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
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="areq-filter__select"
                >
                  <option value="all">All Records</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="overtime">With Overtime</option>
                </select>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="areq-group__select"
                >
                  <option value="none">No Grouping</option>
                  <option value="employee">Group by Employee</option>
                  <option value="shift">Group by Shift</option>
                  <option value="work_type">Group by Work Type</option>
                  <option value="date">Group by Date</option>
                  <option value="status">Group by Status</option>
                </select>
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
                  <div className="areq-table-container">
                    <table className="areq-table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectedRequests.length === filteredRequests.length && filteredRequests.length > 0}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th>Employee</th>
                          <th>Badge ID</th>
                          <th>Date</th>
                          <th>Shift</th>
                          <th>Work Type</th>
                          <th>Clock In</th>
                          <th>Clock Out</th>
                          <th>Worked Hours</th>
                          <th>Overtime</th>
                          <th>Status</th>
                          <th>Reason</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(groupedRequests).map(([groupName, requests]) => (
                          <React.Fragment key={groupName}>
                            {groupBy !== 'none' && (
                              <tr className="areq-group-header">
                                <td colSpan={13}>
                                  <strong>{groupName}</strong> ({requests.length} records)
                                </td>
                              </tr>
                            )}
                            {requests.map((request) => (
                              <tr key={request.id} className="areq-table-row">
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={selectedRequests.includes(request.id)}
                                    onChange={() => handleSelectRequest(request.id)}
                                  />
                                </td>
                                <td>
                                  <div className="areq-employee">
                                    <div className="areq-employee__name">
                                      {request.employee_first_name} {request.employee_last_name}
                                    </div>
                                  </div>
                                </td>
                                <td>{request.badge_id || '-'}</td>
                                <td>{new Date(request.attendance_date).toLocaleDateString()}</td>
                                <td>{request.shift_name || '-'}</td>
                                <td>-</td>
                                <td>{request.attendance_clock_in || '-'}</td>
                                <td>{request.attendance_clock_out || '-'}</td>
                                <td>{request.attendance_worked_hour || '-'}</td>
                                <td>{request.overtime_second > 0 ? `${Math.floor(request.overtime_second / 3600)}:${Math.floor((request.overtime_second % 3600) / 60).toString().padStart(2, '0')}` : '0:00'}</td>
                                <td>
                                  <span className={`areq-status areq-status--${getRequestStatus(request)}`}>
                                    {getRequestStatus(request).charAt(0).toUpperCase() + getRequestStatus(request).slice(1)}
                                  </span>
                                </td>
                                <td>
                                  <div className="areq-reason" title={request.request_description || ''}>
                                    {request.request_description ? (request.request_description.length > 30 ? `${request.request_description.substring(0, 30)}...` : request.request_description) : '-'}
                                  </div>
                                </td>
                                <td>
                                  <div className="areq-actions">
                                    {getRequestStatus(request) === 'pending' && (
                                      <>
                                        <button 
                                          className="areq-action-btn areq-action-btn--approve" 
                                          title="Approve"
                                          onClick={() => handleApproveRequest(request.id)}
                                          disabled={actionLoading[request.id] === 'approving'}
                                        >
                                          {actionLoading[request.id] === 'approving' ? '⏳' : '✓'}
                                        </button>
                                        <button 
                                          className="areq-action-btn areq-action-btn--reject" 
                                          title="Reject"
                                          onClick={() => handleRejectRequest(request.id)}
                                          disabled={actionLoading[request.id] === 'rejecting'}
                                        >
                                          {actionLoading[request.id] === 'rejecting' ? '⏳' : '✗'}
                                        </button>
                                        {request.overtime_second > 0 && (
                                          <button 
                                            className="areq-action-btn areq-action-btn--overtime" 
                                            title="Approve Overtime"
                                            onClick={() => handleApproveOvertime(request.id)}
                                            disabled={actionLoading[request.id] === 'approving_overtime'}
                                          >
                                            {actionLoading[request.id] === 'approving_overtime' ? '⏳' : '⏰'}
                                          </button>
                                        )}
                                      </>
                                    )}
                                    <button 
                                      className="areq-action-btn areq-action-btn--edit" 
                                      title="Edit Request"
                                      onClick={() => handleEditRequest(request)}
                                    >
                                      ✏️
                                    </button>
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
                onClose={() => setShowModal(false)}
                onRefresh={refetch}
                onSuccess={(message) => {
                  console.log('Attendance request result:', message);
                  // You can add a toast notification here if needed
                }}
              />
            </div>
          </div>
        )}

        {/* Edit Attendance Request Modal */}
        {showEditModal && editingRequest && (
          <div className="areq-modal-overlay">
            <div className="areq-modal">
              <AttendanceRequestModal 
                isOpen={showEditModal} 
                onClose={handleCloseEditModal}
                onRefresh={refetch}
                editMode={true}
                attendanceRequestId={editingRequest.id.toString()}
                initialData={{
                  employee_id: editingRequest.employee_id,
                  attendance_date: editingRequest.attendance_date,
                  shift_id: editingRequest.shift_id || 1,
                  work_type_id: editingRequest.work_type_id || 1,
                  minimum_hour: editingRequest.minimum_hour
                }}
                onSuccess={(message) => {
                  console.log('Attendance request edit result:', message);
                  // You can add a toast notification here if needed
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRequests;
