import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import WorkRecordFilterEmployee from './modals/WorkRecordFilterEmployee';
import WorkRecordFilterWorkInfo from './modals/WorkRecordFilterWorkInfo';
import WorkRecordFilterAdvance from './modals/WorkRecordFilterAdvance';
import Sidebar from '../../components/Layout/Sidebar';
import Navbar from '../../components/Layout/Navbar';
import QuickAccess from '../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../contexts/SidebarContext';
import './WorkRecords.css';

const daysInMonth = 31;
const employeeName = 'tarun sai';

const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const WorkRecords: React.FC = () => {

  const { isCollapsed } = useSidebar();
  const [showFilter, setShowFilter] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('employee');
  // Month/year state for input type month
  const [monthYear, setMonthYear] = useState(() => {
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${y}-${m}`;
  });

  // Handle Filter Button in modal (here just closes modal after click, adjust as needed)
  const handleApplyFilter = () => {
    setShowFilter(false);
  };

  // Export table data as Excel file
  const handleExport = () => {
    // Example: Export only the visible table (employeeName and empty cells)
    const headers = ['Employee', ...Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString())];
    const row = [employeeName, ...Array.from({ length: daysInMonth }, () => '')];
    const wsData = [headers, row];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'WorkRecords');
    XLSX.writeFile(wb, 'work-records.xlsx');
  };

  return (
    <div className="work-records-page">
      <Sidebar />
      <div className={`ha-main-content ${isCollapsed ? 'ha-main-content--collapsed' : ''}`}>
        <div className={`ha-navbar ${isCollapsed ? 'ha-navbar--collapsed' : ''}`}>
          <Navbar pageTitle="Work Records" />
        </div>
        <div className="ha-content ha-content--centered">
          {/* Breadcrumb */}
          <div className="ha-breadcrumb">
            <span className="ha-breadcrumb__item">Horilla</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item">attendance</span>
            <span className="ha-breadcrumb__sep">&gt;</span>
            <span className="ha-breadcrumb__item ha-breadcrumb__item--active">work-records</span>
          </div>

          {/* Header Section */}
          <div className="wr-header-card">
            <div className="wr-header-title-row">
              <h1 className="wr-header-title">Work Records</h1>
              <div className="wr-header-date-picker">
                <span className="wr-header-date-label">Date: {formattedDate}</span>
                <label className="wr-header-month-label" htmlFor="wr-header-month-input">Month/Year</label>
                <input
                  id="wr-header-month-input"
                  type="month"
                  className="wr-header-month-input"
                  value={monthYear}
                  onChange={e => setMonthYear(e.target.value)}
                  style={{ minWidth: 120 }}
                />
                <span className="wr-header-month-icon">📅</span>
              </div>
            </div>
            <div className="wr-header-actions">
              <button className="wr-btn wr-btn--export" onClick={handleExport}>Export</button>
              <button className="wr-btn wr-btn--filter" onClick={() => setShowFilter(true)}>Filter</button>
            </div>
            <div className="wr-header-legend">
              <span className="wr-legend-dot wr-legend-dot--present"></span> Present
              <span className="wr-legend-dot wr-legend-dot--halfday"></span> Half Day Present
              <span className="wr-legend-dot wr-legend-dot--onleave"></span> On leave, But attendance exist
              <span className="wr-legend-dot wr-legend-dot--leave"></span> Leave
              <span className="wr-legend-dot wr-legend-dot--absent"></span> Absent
              <span className="wr-legend-dot wr-legend-dot--conflict"></span> Conflict
            </div>
          </div>

          {/* Table Section */}
          <div className="wr-table-container">
            <table className="wr-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <th key={i + 1}>{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{employeeName}</td>
                  {Array.from({ length: daysInMonth }, (_, i) => (
                    <td key={i + 1}></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="wr-pagination">
            <span>Page 1 of 1.</span>
            <span className="wr-pagination-controls">
              Page <input type="text" value="1" readOnly style={{ width: 32, textAlign: 'center' }} /> of 1
            </span>
          </div>
        </div>
        <QuickAccess />

        {/* Slide-Over Filter Panel */}
        {showFilter && (
          <>
            <div className="wr-filter-modal-overlay" onClick={() => setShowFilter(false)}></div>
            <div className="wr-filter-side-panel">
              <button className="wr-filter-modal-close" onClick={() => setShowFilter(false)}>&times;</button>
              <div className="wr-filter-modal-content">
                {/* Accordion sections */}
                <div
                  className={`wr-filter-section ${openSection === 'employee' ? 'wr-filter-section--open' : ''}`}
                  onClick={() => setOpenSection(openSection === 'employee' ? null : 'employee')}
                >
                  <div className="wr-filter-section-title-row">
                    <span className="wr-filter-section-title">Employee</span>
                    <span className={`wr-filter-section-arrow ${openSection === 'employee' ? 'open' : ''}`}>▼</span>
                  </div>
                  <div className="wr-filter-section-divider"></div>
                  <div style={{ display: openSection === 'employee' ? 'block' : 'none', marginTop: 10, marginBottom: 4 }}>
                    <WorkRecordFilterEmployee />
                  </div>
                </div>

                {/* Work Info Section */}
                <div
                  className={`wr-filter-section ${openSection === 'workinfo' ? 'wr-filter-section--open' : ''}`}
                  onClick={() => setOpenSection(openSection === 'workinfo' ? null : 'workinfo')}
                >
                  <div className="wr-filter-section-title-row">
                    <span className="wr-filter-section-title">Work Info</span>
                    <span className={`wr-filter-section-arrow ${openSection === 'workinfo' ? 'open' : ''}`}>▼</span>
                  </div>
                  <div className="wr-filter-section-divider"></div>
                  <div style={{ display: openSection === 'workinfo' ? 'block' : 'none', marginTop: 10, marginBottom: 4 }}>
                    {openSection === 'workinfo' && <WorkRecordFilterWorkInfo />}
                  </div>
                </div>

                {/* Advanced Section */}
                <div
                  className={`wr-filter-section ${openSection === 'advanced' ? 'wr-filter-section--open' : ''}`}
                  onClick={() => setOpenSection(openSection === 'advanced' ? null : 'advanced')}
                >
                  <div className="wr-filter-section-title-row">
                    <span className="wr-filter-section-title">Advanced</span>
                    <span className={`wr-filter-section-arrow ${openSection === 'advanced' ? 'open' : ''}`}>▼</span>
                  </div>
                  <div className="wr-filter-section-divider"></div>
                  <div style={{ display: openSection === 'advanced' ? 'block' : 'none', marginTop: 10, marginBottom: 4 }}>
                    {openSection === 'advanced' && <WorkRecordFilterAdvance />}
                  </div>
                </div>
              </div>
              <button className="wr-btn wr-btn--primary wr-filter-btn" onClick={handleApplyFilter}>
                Filter
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkRecords;
