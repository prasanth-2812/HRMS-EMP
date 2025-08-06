import React, { useEffect, useState } from 'react';
import { Employee } from '../../../types/employee.d';
import { getAllEmployees } from '../../../services/employeeService';
import './EmployeeDashboard.css';

const EmployeeDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);
      } catch (err) {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Show loading state if needed
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="oh-main-wrapper">
      <section className="oh-wrapper oh-main__topbar">
        <div className="oh-main__titlebar oh-main__titlebar--left">
          <h1 className="oh-main__titlebar-title fw-bold mb-0">
            Employee Dashboard
          </h1>
        </div>
      </section>
      
      <div className="oh-wrapper">
        <div className="row">
          {/* Dashboard stats cards */}
          <div className="col-12 col-sm-6 col-md-3 mb-4">
            <div className="oh-card oh-card--stat">
              <div className="oh-card__body">
                <div className="oh-stat">
                  <div className="oh-stat__icon oh-stat__icon--primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="oh-stat__content">
                    <div className="oh-stat__number">{employees.length}</div>
                    <div className="oh-stat__label">Total Employees</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3 mb-4">
            <div className="oh-card oh-card--stat">
              <div className="oh-card__body">
                <div className="oh-stat">
                  <div className="oh-stat__icon oh-stat__icon--success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.67 0 3.22.46 4.56 1.25"></path>
                    </svg>
                  </div>
                  <div className="oh-stat__content">
                    <div className="oh-stat__number">142</div>
                    <div className="oh-stat__label">Present Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3 mb-4">
            <div className="oh-card oh-card--stat">
              <div className="oh-card__body">
                <div className="oh-stat">
                  <div className="oh-stat__icon oh-stat__icon--warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="oh-stat__content">
                    <div className="oh-stat__number">8</div>
                    <div className="oh-stat__label">Late Arrivals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3 mb-4">
            <div className="oh-card oh-card--stat">
              <div className="oh-card__body">
                <div className="oh-stat">
                  <div className="oh-stat__icon oh-stat__icon--danger">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <div className="oh-stat__content">
                    <div className="oh-stat__number">6</div>
                    <div className="oh-stat__label">Absent Today</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Recent employees table */}
          <div className="col-12 col-lg-8 mb-4">
            <div className="oh-card">
              <div className="oh-card__header">
                <h3 className="oh-card__title">Recent Employees</h3>
              </div>
              <div className="oh-card__body">
                <div className="table-responsive">
                  <table className="oh-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.slice(-5).reverse().map((emp) => (
                        <tr key={emp.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="oh-profile oh-profile--sm me-3">
                                <img src={emp.avatar || "/images/upload/userphoto.png"} alt="Employee" className="oh-profile__avatar" />
                              </div>
                              <div>
                                <div className="fw-semibold">{emp.firstName} {emp.lastName}</div>
                                <div className="text-muted small">{emp.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{emp.department}</td>
                          <td>{emp.position}</td>
                          <td>
                            <span className={`oh-badge oh-badge--${emp.status === 'active' ? 'success' : emp.status === 'on_leave' ? 'warning' : 'danger'}`}>{emp.status.charAt(0).toUpperCase() + emp.status.slice(1).replace('_', ' ')}</span>
                          </td>
                          <td>
                            <button className="oh-btn oh-btn--light oh-btn--sm">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="col-12 col-lg-4 mb-4">
            <div className="oh-card">
              <div className="oh-card__header">
                <h3 className="oh-card__title">Quick Actions</h3>
              </div>
              <div className="oh-card__body">
                <div className="d-grid gap-2">
                  <button className="oh-btn oh-btn--primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                    Add New Employee
                  </button>
                  <button className="oh-btn oh-btn--secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Generate Report
                  </button>
                  <button className="oh-btn oh-btn--light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Send Announcement
                  </button>
                  <button className="oh-btn oh-btn--light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82-.33V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09z"></path>
                    </svg>
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Department breakdown */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="oh-card">
              <div className="oh-card__header">
                <h3 className="oh-card__title">Department Breakdown</h3>
              </div>
              <div className="oh-card__body">
                <div className="oh-progress-list">
                  <div className="oh-progress-item">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Engineering</span>
                      <span>45 employees</span>
                    </div>
                    <div className="oh-progress">
                      <div className="oh-progress__bar" style={{ width: '65%', backgroundColor: '#007bff' }}></div>
                    </div>
                  </div>
                  <div className="oh-progress-item">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Marketing</span>
                      <span>28 employees</span>
                    </div>
                    <div className="oh-progress">
                      <div className="oh-progress__bar" style={{ width: '40%', backgroundColor: '#28a745' }}></div>
                    </div>
                  </div>
                  <div className="oh-progress-item">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Sales</span>
                      <span>35 employees</span>
                    </div>
                    <div className="oh-progress">
                      <div className="oh-progress__bar" style={{ width: '50%', backgroundColor: '#ffc107' }}></div>
                    </div>
                  </div>
                  <div className="oh-progress-item">
                    <div className="d-flex justify-content-between mb-1">
                      <span>HR</span>
                      <span>12 employees</span>
                    </div>
                    <div className="oh-progress">
                      <div className="oh-progress__bar" style={{ width: '17%', backgroundColor: '#dc3545' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent activities */}
          <div className="col-12 col-lg-6 mb-4">
            <div className="oh-card">
              <div className="oh-card__header">
                <h3 className="oh-card__title">Recent Activities</h3>
              </div>
              <div className="oh-card__body">
                <div className="oh-activity-list">
                  <div className="oh-activity-item">
                    <div className="oh-activity__icon oh-activity__icon--success">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14"></path>
                        <path d="M5 12h14"></path>
                      </svg>
                    </div>
                    <div className="oh-activity__content">
                      <div>New employee John Doe joined Engineering</div>
                      <div className="text-muted small">2 hours ago</div>
                    </div>
                  </div>
                  <div className="oh-activity-item">
                    <div className="oh-activity__icon oh-activity__icon--warning">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div className="oh-activity__content">
                      <div>Leave request submitted by Jane Smith</div>
                      <div className="text-muted small">4 hours ago</div>
                    </div>
                  </div>
                  <div className="oh-activity-item">
                    <div className="oh-activity__icon oh-activity__icon--info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </div>
                    <div className="oh-activity__content">
                      <div>Monthly report generated</div>
                      <div className="text-muted small">6 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
