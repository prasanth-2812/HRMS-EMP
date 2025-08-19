import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import { apiClient, endpoints } from '../../utils/api';
import './LatecomeEarlyout.css';

// TypeScript interfaces
interface LateComeEarlyOutRecord {
  id: number;
  employee_first_name: string;
  employee_last_name: string;
  is_active: boolean;
  type: 'late_come' | 'early_out';
  created_at: string;
  created_by: number;
  modified_by: number;
  attendance_id: number;
  employee_id: number;
}

const LatecomeEarlyout: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  // State management
  const [records, setRecords] = useState<LateComeEarlyOutRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  // Fetch records on component mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<LateComeEarlyOutRecord[]>(endpoints.attendance.lateComeEarlyOut.list);
      setRecords(response);
    } catch (err) {
      setError('Failed to fetch late come/early out records');
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      setDeleting(id);
      await apiClient.delete(endpoints.attendance.lateComeEarlyOut.delete(id.toString()));
      setRecords(records.filter(record => record.id !== id));
    } catch (err) {
      setError('Failed to delete record');
      console.error('Error deleting record:', err);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTypeLabel = (type: string) => {
    return type === 'late_come' ? 'Late Come' : 'Early Out';
  };

  const getTypeClass = (type: string) => {
    return type === 'late_come' ? 'lce-type--late' : 'lce-type--early';
  };

  return (
    <div className="attendance-activities-page">
      <Sidebar />
      <div className={`ha-main-content ${isCollapsed ? 'ha-main-content--collapsed' : ''}`}>
        <div className={`ha-navbar ${isCollapsed ? 'ha-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="ha-content ha-content--centered">
          {/* Breadcrumb */}
          <div className="ha-breadcrumb">
            <span className="ha-breadcrumb__item">Horilla</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item">attendance</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item ha-breadcrumb__item--active">late-come-early-out</span>
          </div>

          {/* Page Title */}
          <h1 className="ha-header__title">Late Come / Early Out</h1>

          {/* Error State */}
          {error && (
            <div className="lce-error">
              <p>{error}</p>
              <button onClick={fetchRecords} className="lce-retry-btn">Retry</button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="lce-loading">
              <div className="lce-spinner"></div>
              <p>Loading records...</p>
            </div>
          )}

          {/* Data Table */}
          {!loading && !error && (
            <div className="lce-table-container">
              {records.length === 0 ? (
                <div className="ha-empty-state ha-empty-state--centered">
                  <div className="ha-empty-state__icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" stroke="#bdbdbd" strokeWidth="2" fill="none" />
                      <path d="M15.5 15.5L19 19" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="11" cy="11" r="4" stroke="#bdbdbd" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                  <h2 className="ha-empty-state__title">No Records found.</h2>
                  <p className="ha-empty-state__message">There are no late come/early out records to display.</p>
                </div>
              ) : (
                <div className="lce-table-wrapper">
                  <table className="lce-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Type</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record) => (
                        <tr key={record.id}>
                          <td>
                            <div className="lce-employee">
                              <span className="lce-employee__name">
                                {record.employee_first_name} {record.employee_last_name}
                              </span>
                              <span className="lce-employee__id">ID: {record.employee_id}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`lce-type ${getTypeClass(record.type)}`}>
                              {getTypeLabel(record.type)}
                            </span>
                          </td>
                          <td className="lce-date">{formatDate(record.created_at)}</td>
                          <td>
                            <span className={`lce-status ${record.is_active ? 'lce-status--active' : 'lce-status--inactive'}`}>
                              {record.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDelete(record.id)}
                              disabled={deleting === record.id}
                              className="lce-delete-btn"
                              title="Delete record"
                            >
                              {deleting === record.id ? (
                                <span className="lce-btn-spinner"></span>
                              ) : (
                                '🗑️'
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
        <QuickAccess />
      </div>
    </div>
  );
};

export default LatecomeEarlyout;
