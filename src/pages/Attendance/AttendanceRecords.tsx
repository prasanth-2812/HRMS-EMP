import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import { useApi } from '../../hooks/useApi';
import { apiClient } from '../../utils/api';
import AddAttendances from './modals/AddAttendances';
import ImportAttendances from './modals/ImportAttendances';
import EditAttendanceRequestModal from '../../components/Modals/EditAttendanceRequestModal';
import WorkRecordFilterWorkInfo from './modals/WorkRecordFilterWorkInfo';
import WorkRecordFilterEmployee from './modals/WorkRecordFilterEmployee';
import WorkRecordFilterAdvance from './modals/WorkRecordFilterAdvance';
import './AttendanceRecords.css';

interface AttendanceRecord {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  shift_name: string;
  badge_id: string | null;
  employee_profile_url: string;
  work_type: string;
  created_at: string;
  is_active: boolean;
  attendance_date: string;
  attendance_clock_in_date: string;
  attendance_clock_in: string;
  attendance_clock_out_date: string;
  attendance_clock_out: string;
  attendance_worked_hour: string;
  minimum_hour: string;
  attendance_overtime_approve: boolean;
  attendance_validated: boolean;
  is_bulk_request: boolean;
  is_holiday: boolean;
  created_by: number;
  modified_by: number;
  employee_id: number;
  shift_id: number;
  work_type_id: number;
  batch_attendance_id: number;
}

interface AttendanceResponse {
  results: AttendanceRecord[];
  count: number;
}

const AttendanceRecords: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [showModal, setShowModal] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'validate' | 'overtime' | 'validated'>('validate');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [groupBy, setGroupBy] = useState('none');

  // API hooks
  const { data: attendanceData, loading, error, refetch } = useApi<AttendanceResponse>('/api/v1/attendance/attendance/');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Update local state when API data changes
  useEffect(() => {
    if (attendanceData?.results) {
      setAttendanceRecords(attendanceData.results);
    }
  }, [attendanceData]);

  // Filter records based on active tab, search term, and filter
  const filteredRecords = attendanceRecords.filter(record => {
    // Tab filter
    let tabMatch = true;
    switch (activeTab) {
      case 'validate':
        tabMatch = !record.attendance_validated;
        break;
      case 'overtime':
        tabMatch = record.attendance_overtime_approve && record.attendance_validated;
        break;
      case 'validated':
        tabMatch = record.attendance_validated;
        break;
      default:
        tabMatch = true;
    }

    // Search filter
    const searchMatch = searchTerm === '' || 
      record.employee_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employee_last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.shift_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.work_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.attendance_date.includes(searchTerm);

    // Additional filter
    let filterMatch = true;
    switch (filterBy) {
      case 'today':
        const today = new Date().toISOString().split('T')[0];
        filterMatch = record.attendance_date === today;
        break;
      case 'this_week':
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const recordDate = new Date(record.attendance_date);
        filterMatch = recordDate >= weekStart && recordDate <= weekEnd;
        break;
      case 'this_month':
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const recordMonth = new Date(record.attendance_date).getMonth();
        const recordYear = new Date(record.attendance_date).getFullYear();
        filterMatch = recordMonth === currentMonth && recordYear === currentYear;
        break;
      case 'overtime':
        filterMatch = record.attendance_overtime_approve;
        break;
      case 'holiday':
        filterMatch = record.is_holiday;
        break;
      default:
        filterMatch = true;
    }

    return tabMatch && searchMatch && filterMatch;
  });

  // Group records if groupBy is set
  const groupedRecords = groupBy === 'none' ? { 'All Records': filteredRecords } : 
    filteredRecords.reduce((groups, record) => {
      let groupKey = '';
      switch (groupBy) {
        case 'employee':
          groupKey = `${record.employee_first_name} ${record.employee_last_name}`;
          break;
        case 'shift':
          groupKey = record.shift_name;
          break;
        case 'work_type':
          groupKey = record.work_type;
          break;
        case 'date':
          groupKey = record.attendance_date;
          break;
        default:
          groupKey = 'All Records';
      }
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(record);
      return groups;
    }, {} as Record<string, AttendanceRecord[]>);

  // Handle attendance validation using the dedicated validate endpoint
  const handleValidate = async (recordId: number) => {
    try {
      setUpdating(true);
      // Use the dedicated attendance-validate endpoint
      await apiClient.put(`/api/v1/attendance/attendance-validate/${recordId}`);
      // Update local state to reflect validation
      setAttendanceRecords(prev => 
        prev.map(r => 
          r.id === recordId 
            ? { ...r, attendance_validated: true }
            : r
        )
      );
      refetch();
    } catch (error) {
      console.error('Failed to validate attendance:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Handle edit attendance
  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  // Handle delete attendance
  const handleDelete = async (recordId: number) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        setDeleting(true);
        await apiClient.delete(`/api/v1/attendance/attendance/${recordId}`);
        setAttendanceRecords(prev => prev.filter(r => r.id !== recordId));
        refetch();
      } catch (error) {
        console.error('Failed to delete attendance:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRecords.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRecords.length} attendance record(s)?`)) {
      try {
        setDeleting(true);
        const deletePromises = selectedRecords.map(id => 
          apiClient.delete(`/api/v1/attendance/attendance/${id}`)
        );
        await Promise.all(deletePromises);
        setAttendanceRecords(prev => prev.filter(r => !selectedRecords.includes(r.id)));
        setSelectedRecords([]);
        refetch();
      } catch (error) {
        console.error('Failed to delete attendance records:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  // Handle record selection
  const handleSelectRecord = (recordId: number) => {
    setSelectedRecords(prev => 
      prev.includes(recordId) 
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRecords.length === filteredRecords.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(filteredRecords.map(r => r.id));
    }
  };

  // Format time for display
  const formatTime = (time: string) => {
    if (!time) return '-';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date for display
  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get day name from date
  const getDayName = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Calculate pending hours
  const calculatePendingHours = (workedHour: string, minimumHour: string) => {
    const worked = parseFloat(workedHour) || 0;
    const minimum = parseFloat(minimumHour) || 0;
    const pending = Math.max(0, minimum - worked);
    return pending.toFixed(1);
  };

  // Calculate overtime
  const calculateOvertime = (workedHour: string, minimumHour: string) => {
    const worked = parseFloat(workedHour) || 0;
    const minimum = parseFloat(minimumHour) || 0;
    const overtime = Math.max(0, worked - minimum);
    return overtime.toFixed(1);
  };

  // Handle modal close and refresh
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecord(null);
  };
  
  const handleAttendanceSuccess = () => {
    // Refresh the attendance list when a new record is created/updated
    refetch();
    handleCloseModal();
  };

  return (
    <div className="attendance-records-page">
      <Sidebar />
      <div className={`ar-main-content ${isCollapsed ? 'ar-main-content--collapsed' : ''}`}>
        <div className={`ar-navbar ${isCollapsed ? 'ar-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="ar-content">
          <div className="ar-content-container">
            {/* Page Header */}
            <div className="ar-header">
              <div className="ar-header__left">
                <h1 className="ar-header__title">Attendances</h1>
              </div>
              <div className="ar-header__actions">
                <button className="ar-btn ar-btn--secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7,10 12,15 17,10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export Records
                </button>
<<<<<<< HEAD
                {showActions && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    zIndex: 10,
                    minWidth: 160,
                  }}>
                    <button
                      className="ar-btn ar-btn--secondary"
                      style={{ width: '100%', border: 'none', borderRadius: 0, textAlign: 'left', padding: '10px 16px', background: 'none', boxShadow: 'none' }}
                      onClick={() => { setShowActions(false); setShowImportModal(true); }}
                      type="button"
                    >
                      Import
                    </button>
                    <button
                      className="ar-btn ar-btn--secondary"
                      style={{ width: '100%', border: 'none', borderRadius: 0, textAlign: 'left', padding: '10px 16px', background: 'none', boxShadow: 'none' }}
                      onClick={() => { setShowActions(false); handleExport(); }}
                      type="button"
                    >
                      Export
                    </button>
                    <button
                      className="ar-btn ar-btn--secondary"
                      style={{ width: '100%', border: 'none', borderRadius: 0, textAlign: 'left', padding: '10px 16px', background: 'none', boxShadow: 'none' }}
                      onClick={() => { setShowActions(false); handleAddToBatch(); }}
                      type="button"
                      disabled={selectedRecords.length === 0}
                    >
                      Add to Batch
                    </button>
                    <button
                      className="ar-btn ar-btn--secondary"
                      style={{ width: '100%', border: 'none', borderRadius: 0, textAlign: 'left', padding: '10px 16px', background: 'none', boxShadow: 'none' }}
                      onClick={() => { setShowActions(false); handleViewBatches(); }}
                      type="button"
                    >
                      Batches
                    </button>
                    <button
                      className="ar-btn ar-btn--secondary"
                      style={{ width: '100%', border: 'none', borderRadius: 0, textAlign: 'left', padding: '10px 16px', background: 'none', boxShadow: 'none', color: '#dc2626' }}
                      onClick={() => { setShowActions(false); handleBulkDelete(); }}
                      type="button"
                      disabled={selectedRecords.length === 0}
                    >
                      Delete
                    </button>
                  </div>
                )}
                <button
                  className="ar-btn ar-btn--primary"
                  onClick={() => setShowModal(true)}
                >
                  + Create
=======
                <button className="ar-btn ar-btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  View Calendar
>>>>>>> f8f708cfbdf8646b4eea459de903b9beb7be9c1e
                </button>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="ar-controls">
              <div className="ar-search-field">
                <svg className="ar-search-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search by employee name, ID, or department..."
                  className="ar-search-field__input"
                />
              </div>
              <div className="ar-controls__right">
                <div className="ar-filter">
                  <svg className="ar-filter__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
                  </svg>
                  <select
                    className="ar-filter__select"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                  >
                    <option value="all">Filter</option>
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="overtime">Overtime</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <div className="ar-group">
                  <svg className="ar-group__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 6h18M3 12h18M3 18h18"/>
                  </svg>
                  <select
                    className="ar-group__select"
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}
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
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="ar-tabs">
              <button
                className={`ar-tab ${activeTab === 'validate' ? 'ar-tab--active' : ''}`}
                onClick={() => setActiveTab('validate')}
              >
                Validate ({filteredRecords.filter(r => !r.attendance_validated).length})
              </button>
              <button
                className={`ar-tab ${activeTab === 'overtime' ? 'ar-tab--active' : ''}`}
                onClick={() => setActiveTab('overtime')}
              >
                Overtime ({filteredRecords.filter(r => r.attendance_overtime_approve && r.attendance_validated).length})
              </button>
              <button
                className={`ar-tab ${activeTab === 'validated' ? 'ar-tab--active' : ''}`}
                onClick={() => setActiveTab('validated')}
              >
                Validated ({filteredRecords.filter(r => r.attendance_validated).length})
              </button>
            </div>

            {/* Content */}
            <div className="ar-card">
              <div className="ar-card__content">
                <div className="ar-empty-state">
                  <div className="ar-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                  </div>
                ) : error ? (
                  <div className="ar-error">
                    <p>Error loading attendance records: {error}</p>
                    <button className="ar-btn ar-btn--secondary" onClick={refetch}>
                      Retry
                    </button>
                  </div>
                ) : Object.values(groupedRecords).flat().length === 0 ? (
                  <div className="ar-empty-state">
                    <div className="ar-empty-state__icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                      </svg>
                    </div>
                    <h2 className="ar-empty-state__title">No Records found.</h2>
                    <p className="ar-empty-state__message">
                      There are no attendance records to display in this category.
                    </p>
                  </div>
                ) : (
                  <div className="ar-table-container">
                    {selectedRecords.length > 0 && (
                      <div className="ar-bulk-actions">
                        <span>{selectedRecords.length} record(s) selected</span>
                        <button 
                          className="ar-btn ar-btn--danger ar-btn--sm"
                          onClick={handleBulkDelete}
                          disabled={deleting}
                        >
                          {deleting ? 'Deleting...' : 'Delete Selected'}
                        </button>
                      </div>
                    )}
                    <table className="ar-table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              checked={selectedRecords.length === filteredRecords.length && filteredRecords.length > 0}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th>Employee</th>
                          <th>Batch</th>
                          <th>Date</th>
                          <th>Day</th>
                          <th>Check-In</th>
                          <th>In Date</th>
                          <th>Check-Out</th>
                          <th>Out Date</th>
                          <th>Shift</th>
                          <th>Work Type</th>
                          <th>Min Hour</th>
                          <th>At Work</th>
                          <th>Pending Hour</th>
                          <th>Overtime</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(groupedRecords).map(([groupName, records]) => (
                          <React.Fragment key={groupName}>
                            {groupBy !== 'none' && (
                              <tr className="ar-group-header">
                                <td colSpan={16} className="ar-group-title">
                                  <strong>{groupName}</strong> ({records.length} records)
                                </td>
                              </tr>
                            )}
                            {records.map((record) => (
                          <tr key={record.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedRecords.includes(record.id)}
                                onChange={() => handleSelectRecord(record.id)}
                              />
                            </td>
                            <td>
                              <div className="ar-employee">
                                <div className="ar-employee__avatar">
                                  {record.employee_first_name.charAt(0)}{record.employee_last_name.charAt(0)}
                                </div>
                                <div className="ar-employee__info">
                                  <div className="ar-employee__name">
                                    {record.employee_first_name} {record.employee_last_name}
                                  </div>
                                  <div className="ar-employee__id">
                                    {record.badge_id || `EMP-${record.employee_id}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>{record.batch_attendance_id}</td>
                            <td>{formatDate(record.attendance_date)}</td>
                            <td>{getDayName(record.attendance_date)}</td>
                            <td>{formatTime(record.attendance_clock_in)}</td>
                            <td>{formatDate(record.attendance_clock_in_date)}</td>
                            <td>{formatTime(record.attendance_clock_out)}</td>
                            <td>{formatDate(record.attendance_clock_out_date)}</td>
                            <td>{record.shift_name}</td>
                            <td>{record.work_type}</td>
                            <td>{record.minimum_hour}h</td>
                            <td>{record.attendance_worked_hour}h</td>
                            <td>{calculatePendingHours(record.attendance_worked_hour, record.minimum_hour)}h</td>
                            <td>{calculateOvertime(record.attendance_worked_hour, record.minimum_hour)}h</td>
                            <td>
                              <div className="ar-actions">
                                {activeTab === 'validate' && !record.attendance_validated && (
                                  <button
                                    className="ar-btn ar-btn--success ar-btn--sm"
                                    onClick={() => handleValidate(record.id)}
                                    disabled={updating}
                                    title="Validate"
                                  >
                                    {updating ? '...' : '✓'}
                                  </button>
                                )}
                                <button
                                  className="ar-btn ar-btn--secondary ar-btn--sm"
                                  onClick={() => handleEdit(record)}
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="ar-btn ar-btn--info ar-btn--sm"
                                  onClick={() => handleOpenEditRequest(record)}
                                  title="Edit Request"
                                >
                                  📝
                                </button>
                                <button
                                  className="ar-btn ar-btn--danger ar-btn--sm"
                                  onClick={() => handleDelete(record.id)}
                                  disabled={deleting}
                                  title="Delete"
                                >
                                  {deleting ? '...' : '🗑️'}
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
                )}
              </div>
            </div>
          </div>
        </div>

        <QuickAccess />

        {/* AddAttendances Modal */}
        {showModal && (
          <div className="ar-modal-overlay">
            <div className="ar-modal">
              <button className="ar-modal-close-btn" onClick={handleCloseModal}>&times;</button>
              <div className="ar-modal-content">
                <h2>Add Attendance</h2>
                <p>Add attendance functionality will be implemented here.</p>
                <button onClick={handleCloseModal} className="ar-btn ar-btn--primary">Close</button>
              </div>
            </div>
          </div>
        )}
        
        {/* ImportAttendances Modal */}
        {showImportModal && (
          <div className="ar-modal-overlay">
            <div className="ar-modal">
              <button className="ar-modal-close-btn" onClick={() => setShowImportModal(false)}>&times;</button>
              <div className="ar-modal-content">
                <h2>Import Attendances</h2>
                <p>Import functionality will be implemented here.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* EditAttendanceRequestModal */}
        {showEditRequestModal && editingRequestRecord && (
          <div className="ar-modal-overlay">
            <div className="ar-modal">
              <EditAttendanceRequestModal
                record={editingRequestRecord}
                onClose={handleCloseEditRequest}
                onSuccess={handleEditRequestSuccess}
              />
            </div>
          </div>
        )}

        {/* Comprehensive Filter Modal */}
        {showFilterModal && (
          <div className="ar-modal-overlay" onClick={() => setShowFilterModal(false)}>
            <div className="ar-filter-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ar-filter-modal__header">
                <h3 className="ar-filter-modal__title">Filter Attendance Records</h3>
                <button 
                  className="ar-filter-modal__close"
                  onClick={() => setShowFilterModal(false)}
                >
                  &times;
                </button>
              </div>
              
              <div className="ar-filter-modal__tabs">
                <button
                  className={`ar-filter-modal__tab ${activeFilterTab === 'workinfo' ? 'ar-filter-modal__tab--active' : ''}`}
                  onClick={() => setActiveFilterTab('workinfo')}
                >
                  Work Info
                </button>
                <button
                  className={`ar-filter-modal__tab ${activeFilterTab === 'employee' ? 'ar-filter-modal__tab--active' : ''}`}
                  onClick={() => setActiveFilterTab('employee')}
                >
                  Employee
                </button>
                <button
                  className={`ar-filter-modal__tab ${activeFilterTab === 'advance' ? 'ar-filter-modal__tab--active' : ''}`}
                  onClick={() => setActiveFilterTab('advance')}
                >
                  Advanced
                </button>
              </div>
              
              <div className="ar-filter-modal__content">
                {activeFilterTab === 'workinfo' && (
                  <WorkRecordFilterWorkInfo onFilter={(data) => {
                    console.log('Work Info Filter:', data);
                    // TODO: Apply work info filters
                  }} />
                )}
                {activeFilterTab === 'employee' && (
                  <WorkRecordFilterEmployee />
                )}
                {activeFilterTab === 'advance' && (
                  <WorkRecordFilterAdvance onFilter={(data) => {
                    console.log('Advanced Filter:', data);
                    // TODO: Apply advanced filters
                  }} />
                )}
              </div>
            </div>
          </div>
        )}
=======
>>>>>>> f8f708cfbdf8646b4eea459de903b9beb7be9c1e
      </div>
    </div>
  );
};

export default AttendanceRecords;
