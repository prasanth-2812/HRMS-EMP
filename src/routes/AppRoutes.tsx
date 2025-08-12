import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import EmployeeList from '../pages/Employee/Employees/EmployeeList';
import DocumentRequests from '../pages/Employee/DocumentRequests/DocumentRequests';
import ShiftRequests from '../pages/Employee/ShiftRequests/ShiftRequests';
import WorkTypeRequests from '../pages/Employee/WorkTypeRequests/WorkTypeRequests';
import RotatingShiftAssign from '../pages/Employee/RotatingShiftAssign/RotatingShiftAssign';
import RotatingWorkTypeAssign from '../pages/Employee/RotatingWorkTypeAssign/RotatingWorkTypeAssign';
import DisciplinaryActions from '../pages/Employee/DisciplinaryActions/DisciplinaryActions';
import Policies from '../pages/Employee/Policies/Policies';
import OrganizationChart from '../pages/Employee/OrganizationChart/OrganizationChart';
import RecruitmentDashboard from '../pages/Recruitment/RecruitmentDashboard';
import Candidates from '../pages/Recruitment/Candidates';
import JobPostings from '../pages/Recruitment/JobPostings';
import AttendanceRecords from '../pages/Attendance/AttendanceRecords';
import OnboardingPlans from '../pages/Onboarding/OnboardingPlans';

import EmployeeProfile from '../pages/Employee/Profile/EmployeeProfile';
import EmployeeProfileById from '../pages/Employee/Employees/EmployeeProfile';
import LeaveApplications from '../pages/Leave/LeaveApplications';
import PayrollOverview from '../pages/Payroll/PayrollOverview';
import SalarySlips from '../pages/Payroll/SalarySlips';
import PerformanceReviews from '../pages/Performance/PerformanceReviews';
import AssetManagement from '../pages/Assets/AssetManagement';
import HelpDeskTickets from '../pages/HelpDesk/HelpDeskTickets';
import ProjectManagement from '../pages/Project/ProjectManagement';
import OffboardingProcess from '../pages/Offboarding/OffboardingProcess';
import Settings from '../pages/Settings/Settings';

import ProtectedRoute from './ProtectedRoute';
import { useAuthContext } from '../contexts/AuthContext';
import ModalContainer from '../components/Modals/ModalContainer';

import { CompanyInfo, UserPermissions, MenuItem } from '../utils/mockSidebarData';

interface AppRoutesProps {
  companyInfo: CompanyInfo;
  userPermissions: UserPermissions;
  menuItems: MenuItem[];
}

const AppRoutes: React.FC<AppRoutesProps> = ({ companyInfo, userPermissions, menuItems }) => {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  // Simple mapping from path to title for demonstration
  const getPageTitle = (pathname: string): string => {
    switch (pathname) {
      case '/': return 'Dashboard';
      case '/dashboard': return 'Dashboard';
      case '/employee/profile': return 'Employee Profile';
      case '/employee/dashboard': return 'Employee Dashboard';
      case '/employee/employees': return 'Employees';
      case '/employee/document-requests': return 'Document Requests';
      case '/employee/shift-requests': return 'Shift Requests';
      case '/employee/work-type-requests': return 'Work Type Requests';
      case '/employee/rotating-shift-assign': return 'Rotating Shift Assign';
      case '/employee/rotating-work-type-assign': return 'Rotating Work Type Assign';
      case '/employee/disciplinary-actions': return 'Disciplinary Actions';
      case '/employee/policies': return 'Policies';
      case '/employee/organization-chart': return 'Organization Chart';
      case '/employees/list': return 'Employees List';
      case '/recruitment/dashboard': return 'Recruitment Dashboard';
      case '/recruitment/job-postings': return 'Job Postings';
      case '/recruitment/candidates': return 'Candidates';
      case '/recruitments/job-postings': return 'Job Postings';
      case '/recruitments/candidates': return 'Candidates';
      case '/attendance/records': return 'Attendance Records';
      case '/attendances/records': return 'Attendance Records';
      case '/onboarding/plans': return 'Onboarding Plans';
      case '/employees/profile': return 'Employee Profile';
      case '/payroll/overview': return 'Payroll Overview';
      case '/payroll/slips': return 'Salary Slips';
      case '/leave/applications': return 'Leave Applications';
      case '/performance/reviews': return 'Performance Reviews';
      case '/offboarding/process': return 'Offboarding Process';
      case '/assets/management': return 'Asset Management';
      case '/helpdesk/tickets': return 'Help Desk Tickets';
      case '/project/management': return 'Project Management';
      case '/configuration/multiple-approvals': return 'Multiple Approvals';
      case '/configuration/mail-templates': return 'Mail Templates';
      case '/configuration/mail-automations': return 'Mail Automations';
      case '/configuration/holidays': return 'Holidays';
      case '/configuration/company-leaves': return 'Company Leaves';
      case '/configuration/restrict-leaves': return 'Restrict Leaves';
      case '/configuration/system-settings': return 'System Settings';
      case '/settings': return 'Settings';
      default: return 'Horilla'; // Default title
    }
  };

  const currentPageTitle = getPageTitle(location.pathname);

  return (
    <>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Entry point: redirect '/' to /login if not authenticated, else dashboard */}
      <Route path="/" element={
        isAuthenticated ? (
          <ProtectedRoute>
            <Dashboard
              companyInfo={companyInfo}
              userPermissions={userPermissions}
              menuItems={menuItems}
              pageTitle={currentPageTitle}
            />
          </ProtectedRoute>
        ) : (
          <Login />
        )
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard
            companyInfo={companyInfo}
            userPermissions={userPermissions}
            menuItems={menuItems}
            pageTitle={currentPageTitle} // Pass pageTitle
          />
        </ProtectedRoute>
      } />
      {/* Employee Module Routes */}
      <Route path="/employee/profile" element={
        <ProtectedRoute>
          <EmployeeProfile />
        </ProtectedRoute>
      } />
      <Route path="/employee/profile/:id" element={
        <ProtectedRoute>
          <EmployeeProfileById />
        </ProtectedRoute>
      } />
      
      <Route path="/employee/employees" element={
        <ProtectedRoute>
          <EmployeeList />
        </ProtectedRoute>
      } />
      <Route path="/employee/document-requests" element={
        <ProtectedRoute>
          <DocumentRequests />
        </ProtectedRoute>
      } />
      <Route path="/employee/shift-requests" element={
        <ProtectedRoute>
          <ShiftRequests />
        </ProtectedRoute>
      } />
      <Route path="/employee/work-type-requests" element={
        <ProtectedRoute>
          <WorkTypeRequests />
        </ProtectedRoute>
      } />
      <Route path="/employee/rotating-shift-assign" element={
        <ProtectedRoute>
          <RotatingShiftAssign />
        </ProtectedRoute>
      } />
      <Route path="/employee/rotating-work-type-assign" element={
        <ProtectedRoute>
          <RotatingWorkTypeAssign />
        </ProtectedRoute>
      } />
      <Route path="/employee/disciplinary-actions" element={
        <ProtectedRoute>
          <DisciplinaryActions />
        </ProtectedRoute>
      } />
      <Route path="/employee/policies" element={
        <ProtectedRoute>
          <Policies />
        </ProtectedRoute>
      } />
      <Route path="/employee/organization-chart" element={
        <ProtectedRoute>
          <OrganizationChart />
        </ProtectedRoute>
      } />

      {/* Recruitment Module Routes */}
      <Route path="/recruitment/dashboard" element={
        <ProtectedRoute>
          <RecruitmentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/recruitment/job-postings" element={
        <ProtectedRoute>
          <JobPostings />
        </ProtectedRoute>
      } />
      <Route path="/recruitment/candidates" element={
        <ProtectedRoute>
          <Candidates />
        </ProtectedRoute>
      } />

      {/* Attendance Module Routes */}
      <Route path="/attendance/records" element={
        <ProtectedRoute>
          <AttendanceRecords />
        </ProtectedRoute>
      } />

      {/* Onboarding Module Routes */}
      <Route path="/onboarding/plans" element={
        <ProtectedRoute>
          <OnboardingPlans />
        </ProtectedRoute>
      } />

      {/*
        For other pages, you'd render their specific components directly
        and they would implicitly use the Navbar's dynamic pageTitle or have their own Navbar.
        If Navbar is only inside Dashboard, all sub-routes here would not have a Navbar unless explicitly added.
        Since Navbar is part of the layout, it's typically rendered once in App.tsx or a main layout component.
        For simplicity, I'm assuming Dashboard is the main "layout wrapper" for protected routes.
      */}
      <Route path="/employees/list" element={
        <ProtectedRoute>
          <EmployeeList />
        </ProtectedRoute>
      } />
      
      {/* Payroll Module Routes */}
      <Route path="/payroll/overview" element={
        <ProtectedRoute>
          <PayrollOverview />
        </ProtectedRoute>
      } />
      <Route path="/payroll/slips" element={
        <ProtectedRoute>
          <SalarySlips />
        </ProtectedRoute>
      } />
      
      {/* Leave Module Routes */}
      <Route path="/leave/applications" element={
        <ProtectedRoute>
          <LeaveApplications />
        </ProtectedRoute>
      } />
      
      {/* Performance Module Routes */}
      <Route path="/performance/reviews" element={
        <ProtectedRoute>
          <PerformanceReviews />
        </ProtectedRoute>
      } />
      
      {/* Offboarding Module Routes */}
      <Route path="/offboarding/process" element={
        <ProtectedRoute>
          <OffboardingProcess />
        </ProtectedRoute>
      } />
      
      {/* Assets Module Routes */}
      <Route path="/assets/management" element={
        <ProtectedRoute>
          <AssetManagement />
        </ProtectedRoute>
      } />
      
      {/* HelpDesk Module Routes */}
      <Route path="/helpdesk/tickets" element={
        <ProtectedRoute>
          <HelpDeskTickets />
        </ProtectedRoute>
      } />
      
      {/* Project Module Routes */}
      <Route path="/project/management" element={
        <ProtectedRoute>
          <ProjectManagement />
        </ProtectedRoute>
      } />

      {/* Settings Module Routes */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />

      {/* Catch-all for 404 Not Found pages (optional) */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
    <ModalContainer />
    </>
  );
};

export default AppRoutes;
