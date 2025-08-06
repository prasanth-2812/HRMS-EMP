import React, { useState } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Navbar from '../../../components/Layout/Navbar';
import { useSidebar } from '../../../contexts/SidebarContext';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import './OrganizationChart.css';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar: string;
  email: string;
  phone: string;
  managerId?: string;
  subordinates?: Employee[];
}

const OrganizationChart: React.FC = () => {
  const { isCollapsed } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Mock organizational data
  const organizationData: Employee = {
    id: 'EMP-CEO',
    name: 'Prasanth Kathi',
    position: 'Chief Executive Officer',
    department: 'Executive',
    avatar: '/avatars/ceo.jpg',
    email: 'prasanth@company.com',
    phone: '+1-555-0001',
    subordinates: [
      {
        id: 'EMP-CTO',
        name: 'John Smith',
        position: 'Chief Technology Officer',
        department: 'Technology',
        avatar: '/avatars/john-smith.jpg',
        email: 'john.smith@company.com',
        phone: '+1-555-0002',
        managerId: 'EMP-CEO',
        subordinates: [
          {
            id: 'EMP-ENG1',
            name: 'Sarah Johnson',
            position: 'Senior Software Engineer',
            department: 'Engineering',
            avatar: '/avatars/sarah-johnson.jpg',
            email: 'sarah.johnson@company.com',
            phone: '+1-555-0003',
            managerId: 'EMP-CTO'
          },
          {
            id: 'EMP-ENG2',
            name: 'Mike Chen',
            position: 'DevOps Engineer',
            department: 'Engineering',
            avatar: '/avatars/mike-chen.jpg',
            email: 'mike.chen@company.com',
            phone: '+1-555-0004',
            managerId: 'EMP-CTO'
          }
        ]
      },
      {
        id: 'EMP-CHR',
        name: 'Emily Davis',
        position: 'Chief Human Resources Officer',
        department: 'Human Resources',
        avatar: '/avatars/emily-davis.jpg',
        email: 'emily.davis@company.com',
        phone: '+1-555-0005',
        managerId: 'EMP-CEO',
        subordinates: [
          {
            id: 'EMP-HR1',
            name: 'David Wilson',
            position: 'HR Manager',
            department: 'Human Resources',
            avatar: '/avatars/david-wilson.jpg',
            email: 'david.wilson@company.com',
            phone: '+1-555-0006',
            managerId: 'EMP-CHR'
          },
          {
            id: 'EMP-HR2',
            name: 'Lisa Brown',
            position: 'Recruiter',
            department: 'Human Resources',
            avatar: '/avatars/lisa-brown.jpg',
            email: 'lisa.brown@company.com',
            phone: '+1-555-0007',
            managerId: 'EMP-CHR'
          }
        ]
      },
      {
        id: 'EMP-CFO',
        name: 'Robert Taylor',
        position: 'Chief Financial Officer',
        department: 'Finance',
        avatar: '/avatars/robert-taylor.jpg',
        email: 'robert.taylor@company.com',
        phone: '+1-555-0008',
        managerId: 'EMP-CEO',
        subordinates: [
          {
            id: 'EMP-FIN1',
            name: 'Jessica Martinez',
            position: 'Financial Analyst',
            department: 'Finance',
            avatar: '/avatars/jessica-martinez.jpg',
            email: 'jessica.martinez@company.com',
            phone: '+1-555-0009',
            managerId: 'EMP-CFO'
          }
        ]
      }
    ]
  };

  const renderEmployee = (employee: Employee, level: number = 0) => {
    const hasSubordinates = employee.subordinates && employee.subordinates.length > 0;
    
    return (
      <div key={employee.id} className={`oh-org-node oh-org-node--level-${level}`}>
        <div 
          className={`oh-employee-card ${selectedEmployee?.id === employee.id ? 'oh-employee-card--selected' : ''}`}
          onClick={() => setSelectedEmployee(employee)}
        >
          <div className="oh-employee-card__avatar">
            {employee.name.charAt(0)}
          </div>
          <div className="oh-employee-card__info">
            <div className="oh-employee-card__name">{employee.name}</div>
            <div className="oh-employee-card__position">{employee.position}</div>
            <div className="oh-employee-card__department">{employee.department}</div>
          </div>
          {hasSubordinates && (
            <div className="oh-employee-card__subordinates-count">
              {employee.subordinates!.length} report{employee.subordinates!.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        {hasSubordinates && (
          <div className="oh-subordinates">
            <div className="oh-org-connector"></div>
            <div className="oh-subordinates-container">
              {employee.subordinates!.map(subordinate => renderEmployee(subordinate, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Flatten organization for search
  const flattenOrganization = (employee: Employee): Employee[] => {
    let result = [employee];
    if (employee.subordinates) {
      employee.subordinates.forEach(sub => {
        result = result.concat(flattenOrganization(sub));
      });
    }
    return result;
  };

  const allEmployees = flattenOrganization(organizationData);
  const filteredEmployees = allEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="oh-dashboard">
      <Sidebar />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar pageTitle="Organization Chart" />
        <div className="oh-content">
          <div className="oh-container">
            {/* Header Section */}
            <div className="oh-page-header">
              <div className="oh-page-header__content">
                <h1 className="oh-page-title">Organization Chart</h1>
                <p className="oh-page-subtitle">View company organizational structure and employee hierarchy</p>
              </div>
            </div>

            {/* Search */}
            <div className="oh-controls">
              <div className="oh-search-field">
                <svg className="oh-search-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  className="oh-search-field__input"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="oh-org-layout">
              {/* Organization Chart */}
              <div className="oh-org-chart">
                {searchTerm ? (
                  <div className="oh-search-results">
                    <h3>Search Results ({filteredEmployees.length})</h3>
                    <div className="oh-search-results-grid">
                      {filteredEmployees.map(employee => (
                        <div 
                          key={employee.id}
                          className={`oh-employee-card oh-employee-card--search ${selectedEmployee?.id === employee.id ? 'oh-employee-card--selected' : ''}`}
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <div className="oh-employee-card__avatar">
                            {employee.name.charAt(0)}
                          </div>
                          <div className="oh-employee-card__info">
                            <div className="oh-employee-card__name">{employee.name}</div>
                            <div className="oh-employee-card__position">{employee.position}</div>
                            <div className="oh-employee-card__department">{employee.department}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="oh-org-tree">
                    {renderEmployee(organizationData)}
                  </div>
                )}
              </div>

              {/* Employee Details Panel */}
              {selectedEmployee && (
                <div className="oh-employee-details">
                  <div className="oh-employee-details__header">
                    <div className="oh-employee-details__avatar">
                      {selectedEmployee.name.charAt(0)}
                    </div>
                    <div className="oh-employee-details__info">
                      <h3 className="oh-employee-details__name">{selectedEmployee.name}</h3>
                      <p className="oh-employee-details__position">{selectedEmployee.position}</p>
                      <p className="oh-employee-details__department">{selectedEmployee.department}</p>
                    </div>
                    <button 
                      className="oh-employee-details__close"
                      onClick={() => setSelectedEmployee(null)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="oh-employee-details__content">
                    <div className="oh-employee-details__section">
                      <h4>Contact Information</h4>
                      <div className="oh-contact-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <div className="oh-contact-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>{selectedEmployee.phone}</span>
                      </div>
                    </div>

                    {selectedEmployee.managerId && (
                      <div className="oh-employee-details__section">
                        <h4>Reports To</h4>
                        <p>Manager ID: {selectedEmployee.managerId}</p>
                      </div>
                    )}

                    {selectedEmployee.subordinates && selectedEmployee.subordinates.length > 0 && (
                      <div className="oh-employee-details__section">
                        <h4>Direct Reports ({selectedEmployee.subordinates.length})</h4>
                        <div className="oh-subordinates-list">
                          {selectedEmployee.subordinates.map(sub => (
                            <div key={sub.id} className="oh-subordinate-item">
                              <div className="oh-subordinate-avatar">{sub.name.charAt(0)}</div>
                              <div className="oh-subordinate-info">
                                <div className="oh-subordinate-name">{sub.name}</div>
                                <div className="oh-subordinate-position">{sub.position}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {!searchTerm && allEmployees.length === 0 && (
              <div className="oh-empty-state">
                <div className="oh-empty-state__icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
                    <path d="M9 9h.01"></path>
                    <path d="M15 9h.01"></path>
                  </svg>
                </div>
                <h3 className="oh-empty-state__title">No employees found</h3>
                <p className="oh-empty-state__message">
                  No Employees Assigned to Rotating Shifts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <QuickAccess />
    </div>
  );
};

export default OrganizationChart;
