import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import QuickAccess from '../../components/QuickAccess/QuickAccess'; // Import QuickAccess
import { SidebarProvider, useSidebar } from '../../contexts/SidebarContext';
import { CompanyInfo, UserPermissions, MenuItem } from '../../utils/mockSidebarData';
import './Dashboard.css';
import '../../main.css'; // Global styles for the dashboard and app

// Add pageTitle prop to DashboardProps
interface DashboardProps {
  companyInfo: CompanyInfo;
  userPermissions: UserPermissions;
  menuItems: MenuItem[];
  pageTitle: string; // New prop for the page title
}

// Mock components for the attendance modal
const AttendanceRequestModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Attendance Request</h3>
        <p>Attendance request modal content...</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// Internal component that can use the sidebar context
const DashboardContent: React.FC<DashboardProps> = ({ companyInfo, userPermissions, menuItems, pageTitle }) => {
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar(); // Get sidebar collapse state and toggle function

  // Add any existing state and useEffect logic here...
  useEffect(() => {
    // Dashboard initialization logic
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar
        companyInfo={companyInfo}
        userPermissions={userPermissions}
        menuItems={menuItems}
      />
      <div className={`dashboard-main ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Pass the pageTitle prop to Navbar */}
        <Header toggleSidebar={toggleSidebar} />
        <div className="dashboard-content">
          <div className="oh-dashboard-wrapper">
            <div className="oh-dashboard row" id="dashboard">
              {/* Left side - Main content */}
              <div className="oh-dashboard__left col-12 col-sm-12 col-md-12 col-lg-9">
                <div className="oh-dashboard__cards row">
                  {/* Statistics Cards */}
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                    <div className="oh-card-dashboard oh-card-dashboard--success tile">
                      <div className="oh-card-dashboard__header">
                        <span className="oh-card-dashboard__title">New Joining Today</span>
                      </div>
                      <div className="oh-card-dashboard__body">
                        <div className="oh-card-dashboard__counts">
                          <span className="oh-card-dashboard__count">3</span>
                        </div>
                      </div>
                    </div>
                  </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div className="oh-card-dashboard oh-card-dashboard--warning tile">
                <div className="oh-card-dashboard__header">
                  <span className="oh-card-dashboard__title">New Joining This Week</span>
                </div>
                <div className="oh-card-dashboard__body">
                  <div className="oh-card-dashboard__counts">
                    <span className="oh-card-dashboard__count">12</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-4">
              <div className="oh-card-dashboard oh-card-dashboard--neutral tile">
                <div className="oh-card-dashboard__header">
                  <span className="oh-card-dashboard__title">Total Strength</span>
                </div>
                <div className="oh-card-dashboard__body">
                  <div className="oh-card-dashboard__counts">
                    <span className="oh-card-dashboard__count">248</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Dashboard Cards */}
            <div className="oh-dashboard__movable-cards row mt-4">
              <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                <div className="oh-card-dashboard oh-card-dashboard--moveable">
                  <div className="oh-card-dashboard__header">
                    <span className="oh-card-dashboard__title">Attendance Rate</span>
                  </div>
                  <div className="oh-card-dashboard__body">
                    <div className="oh-card-dashboard__counts">
                      <span className="oh-card-dashboard__count">94.2%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                <div className="oh-card-dashboard oh-card-dashboard--moveable">
                  <div className="oh-card-dashboard__header">
                    <span className="oh-card-dashboard__title">Pending Leaves</span>
                  </div>
                  <div className="oh-card-dashboard__body">
                    <div className="oh-card-dashboard__counts">
                      <span className="oh-card-dashboard__count">8</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                <div className="oh-card-dashboard oh-card-dashboard--moveable">
                  <div className="oh-card-dashboard__header">
                    <span className="oh-card-dashboard__title">Open Positions</span>
                  </div>
                  <div className="oh-card-dashboard__body">
                    <div className="oh-card-dashboard__counts">
                      <span className="oh-card-dashboard__count">15</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                <div className="oh-card-dashboard oh-card-dashboard--moveable">
                  <div className="oh-card-dashboard__header">
                    <span className="oh-card-dashboard__title">QA Reviews</span>
                  </div>
                  <div className="oh-card-dashboard__body">
                    <div className="oh-card-dashboard__counts">
                      <span className="oh-card-dashboard__count">4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sidebar content */}
        <div className="oh-dashboard__right col-12 col-sm-12 col-md-12 col-lg-3">
          {/* Birthday Events */}
          <div className="oh-dashboard__events">
            <div className="oh-card-dashboard oh-card-dashboard--no-scale oh-card-dashboard--transparent mb-3">
              <div className="oh-card-dashboard__header">
                <span className="oh-card-dashboard__title">🎉 Birthdays Today</span>
              </div>
              <div className="oh-card-dashboard__body">
                <div className="birthday-list">
                  <p className="no-birthdays">No birthdays today</p>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements */}
          <div className="oh-card-dashboard oh-card-dashboard--no-scale oh-card-dashboard--transparent mb-3">
            <div className="announcements-header">
              <span className="oh-card-dashboard__title">Announcements</span>
              <button className="oh-btn oh-btn--secondary-outline add-announcement-btn">
                +
              </button>
            </div>
            <hr />
            <div className="oh-card-dashboard__body">
              <div className="announcements-list">
                <div className="announcement-item">
                  <h5 className="announcement_title">Welcome New Team Members</h5>
                  <p>Please join us in welcoming our new employees...</p>
                  <small className="text-muted">2 hours ago</small>
                </div>
                <div className="announcement-item">
                  <h5 className="announcement_title">System Maintenance</h5>
                  <p>Scheduled maintenance on Saturday...</p>
                  <small className="text-muted">1 day ago</small>
                </div>
              </div>
            </div>
          </div>

          {/* On Leave */}
          <div className="oh-card-dashboard oh-card-dashboard--no-scale oh-card-dashboard--transparent mb-3">
            <div className="oh-card-dashboard__header oh-card-dashboard__header--divider">
              <span className="oh-card-dashboard__title">On Leave</span>
            </div>
            <div className="oh-card-dashboard__body on-leave-body">
              <div className="leave-list">
                <div className="leave-item">
                  <div className="employee-info">
                    <span className="employee-name">John Doe</span>
                    <small className="leave-type">Annual Leave</small>
                  </div>
                  <span className="leave-duration">Dec 20-22</span>
                </div>
                <div className="leave-item">
                  <div className="employee-info">
                    <span className="employee-name">Jane Smith</span>
                    <small className="leave-type">Sick Leave</small>
                  </div>
                  <span className="leave-duration">Dec 21</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Work Information */}
          <div className="oh-card-dashboard oh-card-dashboard--no-scale oh-card-dashboard--transparent">
            <div className="oh-card-dashboard__header oh-card-dashboard__header--divider">
              <span className="oh-card-dashboard__title">Employee Work Information</span>
            </div>
            <div className="oh-search-bar mb-3">
              <input 
                type="text" 
                placeholder="Search Employee" 
                className="form-control"
              />
            </div>
            <div className="oh-card-dashboard__body">
              <div className="work-info-list">
                <div className="work-info-item">
                  <span className="employee-name">Alice Johnson</span>
                  <small className="work-status">Profile: 85% Complete</small>
                </div>
                <div className="work-info-item">
                  <span className="employee-name">Bob Wilson</span>
                  <small className="work-status">Profile: 92% Complete</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>
      </div>
      <AttendanceRequestModal isOpen={isAttendanceModalOpen} onClose={() => setIsAttendanceModalOpen(false)} />
      
      {/* Quick Access Floating Action Button */}
      <QuickAccess />
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ companyInfo, userPermissions, menuItems, pageTitle }) => {
  return (
    <SidebarProvider>
      <DashboardContent 
        companyInfo={companyInfo}
        userPermissions={userPermissions}
        menuItems={menuItems}
        pageTitle={pageTitle}
      />
    </SidebarProvider>
  );
};

export default Dashboard;
