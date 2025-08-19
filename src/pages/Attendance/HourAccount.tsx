
import React, { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import { useApi } from '../../hooks/useApi';
import { endpoints, apiClient } from '../../utils/api';
import { HourAccount as HourAccountType, HourAccountResponse } from '../../types/hourAccount';
import './HourAccount.css';
import HourAccountForm from './modals/HourAccountForm';

const HourAccount: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HourAccountType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [groupBy, setGroupBy] = useState('');
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'grouped'>('grouped');
  
  // Fetch hour account data
  const { data: hourAccountData, loading, error, refetch } = useApi<HourAccountResponse>(
    endpoints.attendance.hourAccount.list
  );
  
  const hourAccounts = hourAccountData?.results || [];
  
  const handleEdit = (record: HourAccountType) => {
    setEditingRecord(record);
    setShowModal(true);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this hour account record?')) {
      setDeleteId(id.toString());
      try {
        await apiClient.delete(endpoints.attendance.hourAccount.delete(id.toString()));
        refetch();
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setDeleteId(null);
      }
    }
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    setEditingRecord(null);
  };
  
  const handleFormSuccess = () => {
    refetch();
    handleModalClose();
  };
  
  // Filter and search logic
  const filteredHourAccounts = hourAccounts.filter(record => {
    const matchesSearch = searchTerm === '' || 
      `${record.employee_first_name} ${record.employee_last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.badge_id && record.badge_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMonth = filterMonth === '' || record.month.toLowerCase() === filterMonth.toLowerCase();
    const matchesYear = filterYear === '' || record.year === filterYear;
    
    return matchesSearch && matchesMonth && matchesYear;
  });
  
  // Selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRecords([]);
      setSelectAll(false);
    } else {
      setSelectedRecords(filteredHourAccounts.map(record => record.id));
      setSelectAll(true);
    }
  };
  
  const handleSelectRecord = (id: number) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };
  
  // Export functionality
  const handleExport = () => {
    const dataToExport = selectedRecords.length > 0 
      ? filteredHourAccounts.filter(record => selectedRecords.includes(record.id))
      : filteredHourAccounts;
    
    const csvContent = [
      ['Employee Name', 'Badge ID', 'Month', 'Year', 'Worked Hours', 'Pending Hours', 'Overtime'],
      ...dataToExport.map(record => [
        `${record.employee_first_name} ${record.employee_last_name}`,
        record.badge_id || '',
        record.month,
        record.year,
        record.worked_hours,
        record.pending_hours,
        record.overtime
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hour_account_records.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  // Update selectAll state when filtered records change
  React.useEffect(() => {
    if (filteredHourAccounts.length > 0) {
      const allSelected = filteredHourAccounts.every(record => selectedRecords.includes(record.id));
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [selectedRecords, filteredHourAccounts]);
  
  // Get unique months and years for filter options
  const uniqueMonths = Array.from(new Set(hourAccounts?.map(record => record.month) || []));
  const uniqueYears = Array.from(new Set(hourAccounts?.map(record => record.year) || []));

  // Group data by month for grouped view
  const groupedByMonth = React.useMemo(() => {
    const groups: { [key: string]: typeof filteredHourAccounts } = {};
    filteredHourAccounts.forEach(record => {
      const monthKey = `${record.month} ${record.year}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(record);
    });
    return groups;
  }, [filteredHourAccounts]);

  // Auto-expand first month when data loads (only on initial load)
  const [hasInitialized, setHasInitialized] = React.useState(false);
  React.useEffect(() => {
    if (Object.keys(groupedByMonth).length > 0 && !hasInitialized) {
      const firstMonth = Object.keys(groupedByMonth)[0];
      setExpandedMonths(new Set([firstMonth]));
      setHasInitialized(true);
    }
  }, [groupedByMonth, hasInitialized]);

  // Handle month expansion/collapse
  const toggleMonth = (monthKey: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(monthKey)) {
      newExpanded.delete(monthKey);
    } else {
      newExpanded.add(monthKey);
    }
    setExpandedMonths(newExpanded);
  };

  return (
    <div className="hour-account-page">
      <Sidebar />
      <div className={`ha-main-content ${isCollapsed ? 'ha-main-content--collapsed' : ''}`}>
        <div className={`ha-navbar ${isCollapsed ? 'ha-navbar--collapsed' : ''}`}>
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <div className="ha-content">
          <div className="ha-content-container">
            {/* Breadcrumb */}
            <div className="ha-breadcrumb">
            <span className="ha-breadcrumb__item">Horilla</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item">attendance</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item ha-breadcrumb__item--active">attendance-overtime-view</span>
          </div>

          {/* Page Title and Create Button */}
          <div className="ha-header ha-header--space-between">
            <h1 className="ha-header__title">Hour Account</h1>
            <button
              className="ha-btn ha-btn--primary ha-create-btn"
              onClick={() => setShowModal(true)}
            >
              + Create
            </button>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="ha-controls">
            <div className="ha-controls__left">
              <div className="ha-search-box">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ha-search-input"
                />
              </div>
              
              <div className="ha-filter-group">
                <button className="ha-btn ha-btn--filter">
                  🔽 Filter
                </button>
                <div className="ha-filter-content">
                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="ha-filter-select"
                  >
                    <option value="">All Months</option>
                    {uniqueMonths.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="ha-filter-select"
                  >
                    <option value="">All Years</option>
                    {uniqueYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="ha-group-by">
                <button className="ha-btn ha-btn--group">
                  📊 Group by
                </button>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="ha-group-select"
                >
                  <option value="">No Grouping</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
            
            <div className="ha-controls__right">
              <button className="ha-btn ha-btn--actions">
                ⚙️ Actions
              </button>
            </div>
          </div>
          
          {/* Bulk Actions Bar */}
          <div className="ha-bulk-actions">
            <div className="ha-bulk-actions__left">
              <button
                className="ha-btn ha-btn--select"
                onClick={handleSelectAll}
              >
                {selectAll ? 'Unselect All Records' : 'Select All Records'}
              </button>
              
              <button
                className="ha-btn ha-btn--export"
                onClick={handleExport}
                disabled={filteredHourAccounts.length === 0}
              >
                Export Records
              </button>
              
              <button
                className={`ha-btn ${viewMode === 'grouped' ? 'ha-btn--primary' : 'ha-btn--secondary'}`}
                onClick={() => setViewMode(viewMode === 'grouped' ? 'table' : 'grouped')}
              >
                {viewMode === 'grouped' ? '📋 Table View' : '📁 Group View'}
              </button>
              
              {selectedRecords.length > 0 && (
                <span className="ha-selection-count">
                  {selectedRecords.length} - Selected
                </span>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="ha-loading-state ha-loading-state--centered">
              <div className="ha-spinner"></div>
              <p>Loading hour account records...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="ha-error-state ha-error-state--centered">
              <div className="ha-error-state__icon">⚠️</div>
              <h2 className="ha-error-state__title">Error Loading Data</h2>
              <p className="ha-error-state__message">{error}</p>
              <button className="ha-btn ha-btn--secondary" onClick={refetch}>
                Retry
              </button>
            </div>
          )}
          
          {/* Data Table */}
          <div className="ha-table-section">
            {!loading && !error && (
              <>
                {filteredHourAccounts.length === 0 ? (
                  <div className="ha-empty-state ha-empty-state--centered">
                    <div className="ha-empty-state__icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" stroke="#bdbdbd" strokeWidth="2" fill="none" />
                        <path d="M15.5 15.5L19 19" stroke="#bdbdbd" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="11" cy="11" r="4" stroke="#bdbdbd" strokeWidth="2" fill="none" />
                      </svg>
                    </div>
                    <h2 className="ha-empty-state__title">No Records found.</h2>
                    <p className="ha-empty-state__message">There are no hour account records to display.</p>
                  </div>
                ) : viewMode === 'grouped' ? (
                  <div className="ha-month-groups">
                    {Object.entries(groupedByMonth).map(([monthKey, records]) => (
                      <div key={monthKey} className="ha-month-group">
                        <div 
                          className="ha-month-header"
                          onClick={() => toggleMonth(monthKey)}
                        >
                          <div className="ha-month-info">
                            <span className="ha-month-toggle">
                              {expandedMonths.has(monthKey) ? '−' : '+'}
                            </span>
                            <span className="ha-month-name">{monthKey}</span>
                            <span className="ha-month-count">({records.length} records)</span>
                          </div>
                        </div>
                        {expandedMonths.has(monthKey) && (
                          <div className="ha-table-container">
                            <table className="ha-table">
                              <thead>
                                <tr>
                                  <th>
                                    <input
                                      type="checkbox"
                                      checked={records.every(r => selectedRecords.includes(r.id))}
                                      onChange={() => {
                                        const allSelected = records.every(r => selectedRecords.includes(r.id));
                                        if (allSelected) {
                                          setSelectedRecords(prev => prev.filter(id => !records.some(r => r.id === id)));
                                        } else {
                                          setSelectedRecords(prev => Array.from(new Set([...prev, ...records.map(r => r.id)])));
                                        }
                                      }}
                                      className="ha-checkbox"
                                    />
                                  </th>
                                  <th>Employee</th>
                                  <th>Badge ID</th>
                                  <th>Worked Hours</th>
                                  <th>Pending Hours</th>
                                  <th>Overtime</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                 {records.map((record) => (
                                   <tr key={record.id}>
                                     <td>
                                       <input
                                         type="checkbox"
                                         checked={selectedRecords.includes(record.id)}
                                         onChange={() => handleSelectRecord(record.id)}
                                         className="ha-checkbox"
                                       />
                                     </td>
                                     <td>
                                       <div className="ha-employee-info">
                                         <div className="ha-employee-avatar">
                                           {record.employee_profile_url && record.employee_profile_url !== '/404' ? (
                                             <img 
                                               src={record.employee_profile_url} 
                                               alt="Profile" 
                                               onError={(e) => {
                                                 const target = e.target as HTMLImageElement;
                                                 const parent = target.parentElement;
                                                 if (parent) {
                                                   target.style.display = 'none';
                                                   const fallback = parent.querySelector('.ha-employee-avatar-fallback') as HTMLElement;
                                                   if (fallback) fallback.style.display = 'flex';
                                                 }
                                               }}
                                             />
                                           ) : null}
                                           <div className="ha-employee-avatar-fallback" style={{display: record.employee_profile_url && record.employee_profile_url !== '/404' ? 'none' : 'flex'}}>
                                             {record.employee_first_name.charAt(0)}{record.employee_last_name.charAt(0)}
                                           </div>
                                         </div>
                                         <span>{record.employee_first_name} {record.employee_last_name}</span>
                                       </div>
                                     </td>
                                     <td>{record.badge_id || '-'}</td>
                                     <td>{record.worked_hours}</td>
                                     <td>{record.pending_hours}</td>
                                     <td>{record.overtime}</td>
                                     <td>
                                       <div className="ha-action-buttons">
                                         <button 
                                           className="ha-btn ha-btn--small ha-btn--secondary"
                                           onClick={() => handleEdit(record)}
                                           title="Edit"
                                         >
                                           ✏️
                                         </button>
                                         <button 
                                           className="ha-btn ha-btn--small ha-btn--danger"
                                           onClick={() => handleDelete(record.id)}
                                           disabled={deleteId === record.id.toString()}
                                           title="Delete"
                                         >
                                           {deleteId === record.id.toString() ? '⏳' : '🗑️'}
                                         </button>
                                       </div>
                                     </td>
                                   </tr>
                                 ))}
                               </tbody>
                             </table>
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="ha-table-container">
                     <table className="ha-table">
                       <thead>
                         <tr>
                           <th>
                             <input
                               type="checkbox"
                               checked={selectAll && filteredHourAccounts.length > 0}
                               onChange={handleSelectAll}
                               className="ha-checkbox"
                             />
                           </th>
                           <th>Employee</th>
                           <th>Badge ID</th>
                           <th>Month</th>
                           <th>Year</th>
                           <th>Worked Hours</th>
                           <th>Pending Hours</th>
                           <th>Overtime</th>
                           <th>Actions</th>
                         </tr>
                       </thead>
                       <tbody>
                         {filteredHourAccounts.map((record) => (
                           <tr key={record.id}>
                             <td>
                               <input
                                 type="checkbox"
                                 checked={selectedRecords.includes(record.id)}
                                 onChange={() => handleSelectRecord(record.id)}
                                 className="ha-checkbox"
                               />
                             </td>
                             <td>
                               <div className="ha-employee-info">
                                 <div className="ha-employee-avatar">
                                   {record.employee_profile_url && record.employee_profile_url !== '/404' ? (
                                     <img 
                                       src={record.employee_profile_url} 
                                       alt="Profile" 
                                       onError={(e) => {
                                         const target = e.target as HTMLImageElement;
                                         const parent = target.parentElement;
                                         if (parent) {
                                           target.style.display = 'none';
                                           const fallback = parent.querySelector('.ha-employee-avatar-fallback') as HTMLElement;
                                           if (fallback) fallback.style.display = 'flex';
                                         }
                                       }}
                                     />
                                   ) : null}
                                   <div className="ha-employee-avatar-fallback" style={{display: record.employee_profile_url && record.employee_profile_url !== '/404' ? 'none' : 'flex'}}>
                                     {record.employee_first_name.charAt(0)}{record.employee_last_name.charAt(0)}
                                   </div>
                                 </div>
                                 <span>{record.employee_first_name} {record.employee_last_name}</span>
                               </div>
                             </td>
                             <td>{record.badge_id || '-'}</td>
                             <td>{record.month}</td>
                             <td>{record.year}</td>
                             <td>{record.worked_hours}</td>
                             <td>{record.pending_hours}</td>
                             <td>{record.overtime}</td>
                             <td>
                               <div className="ha-action-buttons">
                                 <button 
                                   className="ha-btn ha-btn--small ha-btn--secondary"
                                   onClick={() => handleEdit(record)}
                                   title="Edit"
                                 >
                                   ✏️
                                 </button>
                                 <button 
                                   className="ha-btn ha-btn--small ha-btn--danger"
                                   onClick={() => handleDelete(record.id)}
                                   disabled={deleteId === record.id.toString()}
                                   title="Delete"
                                 >
                                   {deleteId === record.id.toString() ? '⏳' : '🗑️'}
                                 </button>
                               </div>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 )}
            </>
          )}
          </div>
          </div>
        </div>
        <QuickAccess />
        {/* HourAccountForm Modal */}
        {showModal && (
          <div className="ha-modal-overlay">
            <div className="ha-modal">
              <button className="ha-modal-close-btn" onClick={handleModalClose}>&times;</button>
              <HourAccountForm 
                editingRecord={editingRecord}
                onSuccess={handleFormSuccess}
                onCancel={handleModalClose}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HourAccount;
