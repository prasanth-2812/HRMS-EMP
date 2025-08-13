import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import Sidebar from '../../components/Layout/Sidebar';
import Header from '../../components/Layout/Header';
import { useSidebar } from '../../contexts/SidebarContext';
import { CompanyInfo, UserPermissions, MenuItem } from '../../utils/mockSidebarData';
import CompanySettings from '../../components/Configuration/CompanySettings';

import JobPositionSettings from './components/JobPositionSettings';
import JobRoleSettings from './components/JobRoleSettings';
import EmployeeTypeSettings from './components/EmployeeTypeSettings';
import WorkTypeSettings from './components/WorkTypeSettings';
import ShiftSettings from './components/ShiftSettings';
import GeneralSettings from './components/GeneralSettings';
import './BaseSettings.css';

interface Permission {
  codename: string;
  content_type: string;
}

interface ApiUserPermissions {
  permissions: Permission[];
}

interface BaseSettingsProps {
  companyInfo?: CompanyInfo;
  userPermissions?: UserPermissions;
  menuItems?: MenuItem[];
}

const BaseSettings: React.FC<BaseSettingsProps> = ({ 
  companyInfo = {} as CompanyInfo, 
  userPermissions: propUserPermissions = {} as UserPermissions, 
  menuItems = [] 
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const { isCollapsed, toggleSidebar } = useSidebar();
  
  // API call to get user permissions - replacing Django {% if perms.base.view_company %} logic
  const { data: apiUserPermissions } = useApi<ApiUserPermissions>('/auth/permissions');
  
  // Helper function to check permissions - replaces Django template permission checks
  const hasPermission = (permission: string): boolean => {
    if (!apiUserPermissions?.permissions) return false;
    return apiUserPermissions.permissions.some(perm => perm.codename === permission);
  };

  const tabs = [
    {
      id: 'general',
      label: 'General Settings',
      component: GeneralSettings,
      permission: 'view_generalsettings'
    },
    {
      id: 'company',
      label: 'Company',
      component: CompanySettings,
      permission: 'view_company'
    },
    {
      id: 'department',
      label: 'Department',
     
      permission: 'view_department'
    },
    {
      id: 'job-position',
      label: 'Job Position',
      component: JobPositionSettings,
      permission: 'view_jobposition'
    },
    {
      id: 'job-role',
      label: 'Job Role',
      component: JobRoleSettings,
      permission: 'view_jobrole'
    },
    {
      id: 'employee-type',
      label: 'Employee Type',
      component: EmployeeTypeSettings,
      permission: 'view_employeetype'
    },
    {
      id: 'work-type',
      label: 'Work Type',
      component: WorkTypeSettings,
      permission: 'view_worktype'
    },
    {
      id: 'shift',
      label: 'Shift',
      component: ShiftSettings,
      permission: 'view_employeeshift'
    }
  ];

  // Filter tabs based on permissions - replaces Django template conditional rendering
  const visibleTabs = tabs.filter(tab => hasPermission(tab.permission));

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralSettings;

  return (
    <div className="oh-app-layout">
      <Sidebar
        companyInfo={companyInfo}
        userPermissions={propUserPermissions}
        menuItems={menuItems}
      />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="base-settings">
          <div className="base-settings__header">
            <h1 className="base-settings__title">Base Configuration</h1>
            <p className="base-settings__subtitle">
              Manage your organization's core settings and configurations
            </p>
          </div>

          <div className="base-settings__content">
            {/* Tab Navigation - replaces Django template includes */}
            <div className="base-settings__tabs">
              <div className="base-settings__tab-list">
                {visibleTabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`base-settings__tab ${activeTab === tab.id ? 'base-settings__tab--active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content - replaces Django template block content */}
            <div className="base-settings__tab-content">
              <ActiveComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseSettings;