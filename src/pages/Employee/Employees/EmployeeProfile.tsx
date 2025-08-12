import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../../components/Layout/Sidebar';
import Header from '../../../components/Layout/Header';
import QuickAccess from '../../../components/QuickAccess/QuickAccess';
import { useSidebar } from '../../../contexts/SidebarContext';
import apiClient from '../../../services/authService';
import './EmployeeProfile.css';

// Remove mock data and use fetched data
interface EmployeeProfileData {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  country: string;
  state: string;
  city: string;
  qualification: string;
  experience: string;
  maritalStatus: string;
  children: string;
  emergencyContact: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  department: string;
  position: string;
  manager: string;
  dateOfJoining: string;
  employmentType: string;
  workLocation: string;
  salary: string;
  contractStartDate: string;
  contractEndDate: string;
  probationPeriod: string;
}

interface BankInfo {
  id?: number | null;
  bankName: string;
  accountNumber: string;
  branch: string;
  address: string;
  country: string;
  state: string;
  city: string;
  anyOtherCode1: string;
  anyOtherCode2: string;
  additionalInfo: string;
  employeeId?: number | null;
  isActive?: boolean;
}

interface EmployeeWorkInfo {
  id?: number | null;
  tags: string[];
  location: string | null;
  email: string | null;
  mobile: string | null;
  date_joining: string | null;
  contract_end_date: string | null;
  basic_salary: number;
  salary_hour: number;
  additional_info: string | null;
  experience: number;
  employee_id: number | null;
  department_id: number | null;
  job_position_id: number | null;
  job_role_id: number | null;
  reporting_manager_id: number | null;
  shift_id: number | null;
  work_type_id: number | null;
  employee_type_id: number | null;
  company_id: number | null;
}

// Interface for Employee Contract API
interface EmployeeContract {
  id?: number;
  contract: string | null;
  employee_id: number | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  wage_type: string | null;
  pay_frequency: string | null;
  basic_salary: number;
  filing_status: string | null;
  department_id: number | null;
  job_position_id: number | null;
  job_role_id: number | null;
  shift_id: number | null;
  work_type_id: number | null;
  notice_period: number;
  contract_document: string | null;
  deduct_from_basic_pay: boolean;
  calculate_daily_leave_amount_pay: boolean;
  note: string | null;
}

const EmployeeProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('about');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingWork, setIsEditingWork] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingContract, setIsEditingContract] = useState(false);
  const [personalFormData, setPersonalFormData] = useState<EmployeeProfileData | null>(null);
  const [bankFormData, setBankFormData] = useState<BankInfo | null>(null);
  const [workFormData, setWorkFormData] = useState<EmployeeWorkInfo | null>(null);
  const [contractFormData, setContractFormData] = useState<EmployeeContract | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<string>('');
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Map API response keys to UI fields
  function mapApiToProfileData(apiData: any): EmployeeProfileData {
    return {
      id: apiData.id,
      employeeId: apiData.badge_id ?? '',
      firstName: apiData.employee_first_name ?? '',
      lastName: apiData.employee_last_name ?? '',
      email: apiData.email ?? '',
      phone: apiData.phone ?? '',
      dateOfBirth: apiData.dob ?? '',
      gender: apiData.gender ?? '',
      address: apiData.address ?? '',
      country: apiData.country ?? '',
      state: apiData.state ?? '',
      city: apiData.city ?? '',
      qualification: apiData.qualification ?? '',
      experience: apiData.experience ?? '',
      maritalStatus: apiData.marital_status ?? '',
      children: apiData.children ?? '',
      emergencyContact: apiData.emergency_contact ?? '',
      emergencyContactName: apiData.emergency_contact_name ?? '',
      emergencyContactRelation: apiData.emergency_contact_relation ?? '',
      department: apiData.department ?? '',
      position: apiData.job_position ?? '',
      manager: apiData.reporting_manager ?? '',
      dateOfJoining: '', // not in API
      employmentType: apiData.employee_type ?? '',
      workLocation: '', // not in API
      salary: '', // not in API
      contractStartDate: '', // not in API
      contractEndDate: '', // not in API
      probationPeriod: '', // not in API
    };
  }

  // Function to fetch bank details
  const fetchBankDetails = async (employeeId: number) => {
    try {
      const token = localStorage.getItem('access');
      const response = await apiClient.get('/api/v1/employee/employee-bank-details/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter bank details for the specific employee
      const employeeBankDetails = response.data.find((bankDetail: any) => 
        bankDetail.employee_id === employeeId
      );
      
      if (employeeBankDetails) {
        const bankData: BankInfo = {
          id: employeeBankDetails.id,
          bankName: employeeBankDetails.bank_name || '',
          accountNumber: employeeBankDetails.account_number || '',
          branch: employeeBankDetails.branch || '',
          address: employeeBankDetails.address || '',
          country: employeeBankDetails.country || '',
          state: employeeBankDetails.state || '',
          city: employeeBankDetails.city || '',
          anyOtherCode1: employeeBankDetails.any_other_code1 || '',
          anyOtherCode2: employeeBankDetails.any_other_code2 || '',
          additionalInfo: employeeBankDetails.additional_info || '',
          employeeId: employeeBankDetails.employee_id,
          isActive: employeeBankDetails.is_active
        };
        setBankFormData(bankData);
      } else {
        // No bank details found for this employee
        setBankFormData(null);
      }
    } catch (error: any) {
      console.error('Error fetching bank details:', error);
      setBankFormData(null);
    }
  };

  // Function to fetch work information
  const fetchWorkInformation = async (employeeId: number) => {
    try {
      const token = localStorage.getItem('access');
      const response = await apiClient.get(`/api/v1/employee/employee-work-information/${employeeId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        const workData: EmployeeWorkInfo = {
          id: response.data.id,
          tags: response.data.tags || [],
          location: response.data.location,
          email: response.data.email,
          mobile: response.data.mobile,
          date_joining: response.data.date_joining,
          contract_end_date: response.data.contract_end_date,
          basic_salary: response.data.basic_salary || 0,
          salary_hour: response.data.salary_hour || 0,
          additional_info: response.data.additional_info,
          experience: response.data.experience || 0,
          employee_id: response.data.employee_id,
          department_id: response.data.department_id,
          job_position_id: response.data.job_position_id,
          job_role_id: response.data.job_role_id,
          reporting_manager_id: response.data.reporting_manager_id,
          shift_id: response.data.shift_id,
          work_type_id: response.data.work_type_id,
          employee_type_id: response.data.employee_type_id,
          company_id: response.data.company_id
        };
        setWorkFormData(workData);
      } else {
        // No work information found for this employee
        setWorkFormData(null);
      }
    } catch (error: any) {
      console.error('Error fetching work information:', error);
      if (error.response?.status === 404) {
        // Work information doesn't exist yet, set empty form
        setWorkFormData({
          tags: [],
          location: null,
          email: null,
          mobile: null,
          date_joining: null,
          contract_end_date: null,
          basic_salary: 0,
          salary_hour: 0,
          additional_info: null,
          experience: 0,
          employee_id: employeeId,
          department_id: null,
          job_position_id: null,
          job_role_id: null,
          reporting_manager_id: null,
          shift_id: null,
          work_type_id: null,
          employee_type_id: null,
          company_id: null
        });
      } else {
        setWorkFormData(null);
      }
    }
  };

  // Function to fetch contract details
  const fetchContractDetails = async (employeeId: number) => {
    try {
      const token = localStorage.getItem('access');
      const response = await apiClient.get('/api/v1/employee/employee-contract/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter contract details for the specific employee
      const employeeContract = response.data.find((contract: any) => 
        contract.employee_id === employeeId
      );
      
      if (employeeContract) {
        const contractData: EmployeeContract = {
          id: employeeContract.id,
          contract: employeeContract.contract,
          employee_id: employeeContract.employee_id,
          contract_start_date: employeeContract.contract_start_date,
          contract_end_date: employeeContract.contract_end_date,
          wage_type: employeeContract.wage_type,
          pay_frequency: employeeContract.pay_frequency,
          basic_salary: employeeContract.basic_salary || 0,
          filing_status: employeeContract.filing_status,
          department_id: employeeContract.department_id,
          job_position_id: employeeContract.job_position_id,
          job_role_id: employeeContract.job_role_id,
          shift_id: employeeContract.shift_id,
          work_type_id: employeeContract.work_type_id,
          notice_period: employeeContract.notice_period || 0,
          contract_document: employeeContract.contract_document,
          deduct_from_basic_pay: employeeContract.deduct_from_basic_pay || false,
          calculate_daily_leave_amount_pay: employeeContract.calculate_daily_leave_amount_pay || false,
          note: employeeContract.note
        };
        setContractFormData(contractData);
      } else {
        // No contract details found for this employee
        setContractFormData(null);
      }
    } catch (error: any) {
      console.error('Error fetching contract details:', error);
      setContractFormData(null);
    }
  };

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    apiClient.get(`/api/v1/employee/employees/${id}/`)
      .then((res) => {
        const data = res.data;
        setPersonalFormData(mapApiToProfileData(data));
        setFetchError(null);
        // Fetch bank details, work information, and contract details after getting employee data
        fetchBankDetails(data.id);
        fetchWorkInformation(data.id);
        fetchContractDetails(data.id);
      })
      .catch((err) => {
        setFetchError(err.message || 'Failed to fetch employee profile');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const hasUnsavedChanges = () => {
    return isEditingPersonal || isEditingWork || isEditingBank || isEditingContract;
  };

  const handleTabSwitch = (tabName: string) => {
    if (hasUnsavedChanges() && tabName !== activeTab) {
      setPendingTab(tabName);
      setShowConfirmDialog(true);
    } else {
      setActiveTab(tabName);
    }
  };

  const confirmTabSwitch = () => {
    // Reset all edit states
    setIsEditingPersonal(false);
    setIsEditingWork(false);
    setIsEditingBank(false);
    setIsEditingContract(false);
    
    // Reset form data
    setPersonalFormData(null);
    setBankFormData(null);
    setWorkFormData(null);
    setContractFormData(null);
    
    // Switch to pending tab
    setActiveTab(pendingTab);
    setShowConfirmDialog(false);
    showNotificationMessage('Unsaved changes discarded', 'info');
  };

  const cancelTabSwitch = () => {
    setShowConfirmDialog(false);
    setPendingTab('');
  };

  const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  const handlePersonalSave = async () => {
    if (!personalFormData) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access');
      const payload = {
        employee_first_name: personalFormData.firstName,
        employee_last_name: personalFormData.lastName,
        email: personalFormData.email,
        phone: personalFormData.phone,
        address: personalFormData.address,
        country: personalFormData.country,
        state: personalFormData.state,
        city: personalFormData.city,
        dob: personalFormData.dateOfBirth,
        gender: personalFormData.gender,
        qualification: personalFormData.qualification,
  experience: personalFormData.experience ? parseInt(personalFormData.experience, 10) : 0,
        marital_status: personalFormData.maritalStatus,
  children: personalFormData.children ? parseInt(personalFormData.children, 10) : 0,
        emergency_contact: personalFormData.emergencyContact,
        emergency_contact_name: personalFormData.emergencyContactName,
        emergency_contact_relation: personalFormData.emergencyContactRelation,
      };
      const res = await apiClient.put(
        `/api/v1/employee/employees/${personalFormData.id}/`,
        payload,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      const refetch = await apiClient.get(`/api/v1/employee/employees/${personalFormData.id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setPersonalFormData(mapApiToProfileData(refetch.data));
      setIsEditingPersonal(false);
      const msg = res.data?.message || 'Personal information updated.';
      showNotificationMessage(msg, 'success');
    } catch (error: any) {
      let msg = 'Failed to update personal information.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') msg = error.response.data;
        else if (error.response.data.message) msg = error.response.data.message;
        else if (typeof error.response.data === 'object') msg = Object.entries(error.response.data).map(([k,v]) => `${k}: ${v}`).join(' ');
      }
      showNotificationMessage(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalCancel = () => {
    setPersonalFormData(null);
    setIsEditingPersonal(false);
    showNotificationMessage('Changes discarded', 'info');
  };

  const handleBankSave = async () => {
    if (!personalFormData || !bankFormData) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access');
      const payload = {
        bank_name: bankFormData.bankName,
        account_number: bankFormData.accountNumber,
        branch: bankFormData.branch,
        address: bankFormData.address,
        country: bankFormData.country,
        state: bankFormData.state,
        city: bankFormData.city,
        any_other_code1: bankFormData.anyOtherCode1,
        any_other_code2: bankFormData.anyOtherCode2,
        additional_info: bankFormData.additionalInfo,
        employee_id: personalFormData.id,
        is_active: true
      };

      let res;
      if (bankFormData.id) {
        // Update existing bank details
        res = await apiClient.put(
          `/api/v1/employee/employee-bank-details/${bankFormData.id}/`,
          payload,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new bank details
        res = await apiClient.post(
          `/api/v1/employee/employee-bank-details/`,
          payload,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
      }

      // Update the bank form data with the response
      if (res.data) {
        const updatedBankData: BankInfo = {
          id: res.data.id,
          bankName: res.data.bank_name || '',
          accountNumber: res.data.account_number || '',
          branch: res.data.branch || '',
          address: res.data.address || '',
          country: res.data.country || '',
          state: res.data.state || '',
          city: res.data.city || '',
          anyOtherCode1: res.data.any_other_code1 || '',
          anyOtherCode2: res.data.any_other_code2 || '',
          additionalInfo: res.data.additional_info || '',
          employeeId: res.data.employee_id,
          isActive: res.data.is_active
        };
        setBankFormData(updatedBankData);
      }

      setIsEditingBank(false);
      const msg = res.data?.message || 'Bank information saved successfully.';
      showNotificationMessage(msg, 'success');
    } catch (error: any) {
      let msg = 'Failed to save bank information.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') msg = error.response.data;
        else if (error.response.data.message) msg = error.response.data.message;
        else if (typeof error.response.data === 'object') msg = Object.entries(error.response.data).map(([k,v]) => `${k}: ${v}`).join(' ');
      }
      showNotificationMessage(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankCancel = () => {
    // Reset to original data or null if no bank details exist
    if (personalFormData?.id) {
      fetchBankDetails(personalFormData.id);
    } else {
      setBankFormData(null);
    }
    setIsEditingBank(false);
    showNotificationMessage('Changes discarded', 'info');
  };

  const handleBankDelete = async () => {
    if (!bankFormData?.id) return;
    
    if (!window.confirm('Are you sure you want to delete the bank details?')) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('access');
      await apiClient.delete(
        `/api/v1/employee/employee-bank-details/${bankFormData.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBankFormData(null);
      setIsEditingBank(false);
      showNotificationMessage('Bank details deleted successfully.', 'success');
    } catch (error: any) {
      let msg = 'Failed to delete bank details.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') msg = error.response.data;
        else if (error.response.data.message) msg = error.response.data.message;
        else if (typeof error.response.data === 'object') msg = Object.entries(error.response.data).map(([k,v]) => `${k}: ${v}`).join(' ');
      }
      showNotificationMessage(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkSave = async () => {
    if (!workFormData || !personalFormData) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access');
      const payload = {
        tags: workFormData.tags,
        location: workFormData.location,
        email: workFormData.email,
        mobile: workFormData.mobile,
        date_joining: workFormData.date_joining,
        contract_end_date: workFormData.contract_end_date,
        basic_salary: workFormData.basic_salary,
        salary_hour: workFormData.salary_hour,
        additional_info: workFormData.additional_info,
        experience: workFormData.experience,
        employee_id: personalFormData.id,
        department_id: workFormData.department_id,
        job_position_id: workFormData.job_position_id,
        job_role_id: workFormData.job_role_id,
        reporting_manager_id: workFormData.reporting_manager_id,
        shift_id: workFormData.shift_id,
        work_type_id: workFormData.work_type_id,
        employee_type_id: workFormData.employee_type_id,
        company_id: workFormData.company_id
      };

      let res;
      if (workFormData.id) {
        // Update existing work information
        res = await apiClient.put(
          `/api/v1/employee/employee-work-information/${workFormData.id}/`,
          payload,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new work information
        res = await apiClient.post(
          `/api/v1/employee/employee-work-information/`,
          payload,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh work information data
      await fetchWorkInformation(personalFormData.id);
      setIsEditingWork(false);
      const msg = res.data?.message || 'Work information saved successfully.';
      showNotificationMessage(msg, 'success');
    } catch (error: any) {
      let msg = 'Failed to save work information.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') msg = error.response.data;
        else if (error.response.data.message) msg = error.response.data.message;
        else if (typeof error.response.data === 'object') msg = Object.entries(error.response.data).map(([k,v]) => `${k}: ${v}`).join(' ');
      }
      showNotificationMessage(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkCancel = () => {
    if (personalFormData) {
      // Reset work form data to original values
      fetchWorkInformation(personalFormData.id);
    }
    setIsEditingWork(false);
    showNotificationMessage('Changes discarded', 'info');
  };

  const handleWorkDelete = async () => {
    if (!workFormData?.id || !personalFormData) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access');
      await apiClient.delete(
        `/api/v1/employee/employee-work-information/${workFormData.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Reset work form data to empty state
      setWorkFormData({
        tags: [],
        location: null,
        email: null,
        mobile: null,
        date_joining: null,
        contract_end_date: null,
        basic_salary: 0,
        salary_hour: 0,
        additional_info: null,
        experience: 0,
        employee_id: personalFormData.id,
        department_id: null,
        job_position_id: null,
        job_role_id: null,
        reporting_manager_id: null,
        shift_id: null,
        work_type_id: null,
        employee_type_id: null,
        company_id: null
      });
      
      setIsEditingWork(false);
      showNotificationMessage('Work information deleted successfully.', 'success');
    } catch (error: any) {
      let msg = 'Failed to delete work information.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') msg = error.response.data;
        else if (error.response.data.message) msg = error.response.data.message;
        else if (typeof error.response.data === 'object') msg = Object.entries(error.response.data).map(([k,v]) => `${k}: ${v}`).join(' ');
      }
      showNotificationMessage(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContractSave = async () => {
    if (!contractFormData || !personalFormData) return;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access');
      const payload = {
        contract: contractFormData.contract,
        employee_id: personalFormData.id,
        contract_start_date: contractFormData.contract_start_date,
        contract_end_date: contractFormData.contract_end_date,
        wage_type: contractFormData.wage_type,
        pay_frequency: contractFormData.pay_frequency,
        basic_salary: contractFormData.basic_salary,
        filing_status: contractFormData.filing_status,
        department_id: contractFormData.department_id,
        job_position_id: contractFormData.job_position_id,
        job_role_id: contractFormData.job_role_id,
        shift_id: contractFormData.shift_id,
        work_type_id: contractFormData.work_type_id,
        notice_period: contractFormData.notice_period,
        deduct_from_basic_pay: contractFormData.deduct_from_basic_pay,
        calculate_daily_leave_amount_pay: contractFormData.calculate_daily_leave_amount_pay,
        note: contractFormData.note
      };

      let res;
      if (contractFormData.id) {
        // Update existing contract
        res = await apiClient.put(
          `/api/v1/employee/employee-contract/${contractFormData.id}/`,
          payload,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new contract
        res = await apiClient.post(
          `/api/v1/employee/employee-contract/`,
          payload,
          { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
        );
      }

      // Refetch contract details
      fetchContractDetails(personalFormData.id);
      setIsEditingContract(false);
      const msg = res.data?.message || 'Contract details saved successfully.';
      showNotificationMessage(msg, 'success');
    } catch (error: any) {
      let msg = 'Failed to save contract details.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') msg = error.response.data;
        else if (error.response.data.message) msg = error.response.data.message;
        else if (typeof error.response.data === 'object') msg = Object.entries(error.response.data).map(([k,v]) => `${k}: ${v}`).join(' ');
      }
      showNotificationMessage(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContractCancel = () => {
    // Reset to original data
    if (personalFormData?.id) {
      fetchContractDetails(personalFormData.id);
    } else {
      setContractFormData(null);
    }
    setIsEditingContract(false);
    showNotificationMessage('Changes discarded', 'info');
  };

  const handleSaveAllChanges = async () => {
    if (!personalFormData) return;
    setIsLoading(true);
    
    let profileSuccess = false;
    let bankSuccess = false;
    
    try {
      const token = localStorage.getItem('access');
      
      // Save employee profile first (excluding bank information)
      const profilePayload = {
        employee_first_name: personalFormData.firstName,
        employee_last_name: personalFormData.lastName,
        email: personalFormData.email,
        phone: personalFormData.phone,
        address: personalFormData.address,
        country: personalFormData.country,
        state: personalFormData.state,
        city: personalFormData.city,
        dob: personalFormData.dateOfBirth,
        gender: personalFormData.gender,
        qualification: personalFormData.qualification,
        experience: personalFormData.experience ? parseInt(personalFormData.experience, 10) : 0,
        marital_status: personalFormData.maritalStatus,
        children: personalFormData.children ? parseInt(personalFormData.children, 10) : 0,
        emergency_contact: personalFormData.emergencyContact,
        emergency_contact_name: personalFormData.emergencyContactName,
        emergency_contact_relation: personalFormData.emergencyContactRelation,
        department: personalFormData.department,
        job_position: personalFormData.position,
        reporting_manager: personalFormData.manager,
        employee_type: personalFormData.employmentType,
        salary: personalFormData.salary,
        contract_start_date: personalFormData.contractStartDate,
        contract_end_date: personalFormData.contractEndDate,
        probation_period: personalFormData.probationPeriod,
      };
      
      await apiClient.put(
        `/api/v1/employee/employees/${personalFormData.id}/`,
        profilePayload,
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
      );
      
      profileSuccess = true;
      
      // Refetch employee data
      const refetch = await apiClient.get(`/api/v1/employee/employees/${personalFormData.id}/`, { headers: { Authorization: `Bearer ${token}` } });
      setPersonalFormData(mapApiToProfileData(refetch.data));
      
      // Save bank details separately if they exist
      if (bankFormData) {
        const bankPayload = {
          bank_name: bankFormData.bankName,
          account_number: bankFormData.accountNumber,
          branch: bankFormData.branch,
          address: bankFormData.address,
          country: bankFormData.country,
          state: bankFormData.state,
          city: bankFormData.city,
          any_other_code1: bankFormData.anyOtherCode1,
          any_other_code2: bankFormData.anyOtherCode2,
          additional_info: bankFormData.additionalInfo,
          employee_id: personalFormData.id,
          is_active: true
        };

        let bankRes;
        if (bankFormData.id) {
          // Update existing bank details
          bankRes = await apiClient.put(
            `/api/v1/employee/employee-bank-details/${bankFormData.id}/`,
            bankPayload,
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
          );
        } else {
          // Create new bank details
          bankRes = await apiClient.post(
            `/api/v1/employee/employee-bank-details/`,
            bankPayload,
            { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
          );
        }

        // Update the bank form data with the response
        if (bankRes.data) {
          const updatedBankData: BankInfo = {
            id: bankRes.data.id,
            bankName: bankRes.data.bank_name || '',
            accountNumber: bankRes.data.account_number || '',
            branch: bankRes.data.branch || '',
            address: bankRes.data.address || '',
            country: bankRes.data.country || '',
            state: bankRes.data.state || '',
            city: bankRes.data.city || '',
            anyOtherCode1: bankRes.data.any_other_code1 || '',
            anyOtherCode2: bankRes.data.any_other_code2 || '',
            additionalInfo: bankRes.data.additional_info || '',
            employeeId: bankRes.data.employee_id,
            isActive: bankRes.data.is_active
          };
          setBankFormData(updatedBankData);
        }
        
        bankSuccess = true;
      }
      
      // Reset all edit states
      setIsEditingPersonal(false);
      setIsEditingWork(false);
      setIsEditingBank(false);
      setIsEditingContract(false);
      
      // Show success message
      if (profileSuccess && bankSuccess) {
        showNotificationMessage('Profile and bank details updated successfully!', 'success');
      } else if (profileSuccess) {
        showNotificationMessage('Profile updated successfully!', 'success');
      }
      
    } catch (error: any) {
      let msg = 'Failed to update profile.';
      if (profileSuccess && !bankSuccess) {
        msg = 'Profile updated but failed to save bank details.';
      }
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') msg = error.response.data;
        else if (error.response.data.message) msg = error.response.data.message;
        else if (typeof error.response.data === 'object') msg = Object.entries(error.response.data).map(([k,v]) => `${k}: ${v}`).join(' ');
      }
      showNotificationMessage(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAllChanges = () => {
    // Reset all form data
    setPersonalFormData(null);
    setBankFormData(null);
    
    // Reset all edit states
    setIsEditingPersonal(false);
    setIsEditingWork(false);
    setIsEditingBank(false);
    setIsEditingContract(false);
    
    showNotificationMessage('All changes discarded', 'info');
  };

  const handleTabEdit = (tabName: string) => {
    // Navigate to the specific tab and enable editing
    setActiveTab(tabName);
    
    // Enable editing for the specific section
    switch (tabName) {
      case 'about':
        setIsEditingPersonal(true);
        setIsEditingWork(true);
        setIsEditingBank(true);
        setIsEditingContract(true);
        break;
      case 'work-type-shift':
        // Handle work type editing if needed
        break;
      case 'documents':
        // Handle document editing if needed
        break;
      default:
        break;
    }
    
    showNotificationMessage(`Switched to ${tabName} section in edit mode`, 'info');
  };

  // In renderTabContent, add loading and error states
  const renderTabContent = () => {
    if (isLoading && !personalFormData) return <div>Loading...</div>;
    if (fetchError) return <div style={{color:'red'}}>Error: {fetchError}</div>;
    if (!personalFormData) return <div>No profile data found.</div>;

    switch (activeTab) {
      case 'about':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Personal Information Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Personal Information</h3>
                  <div className="oh-profile-card-actions">
                    {!isEditingPersonal ? (
                      <button 
                        className="oh-profile-edit-btn-small"
                        onClick={() => setIsEditingPersonal(true)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                    ) : (
                      <div className="oh-profile-edit-actions">
                        <button 
                          className="oh-profile-save-btn"
                          onClick={handlePersonalSave}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="oh-loading-spinner"></div>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                          Save
                        </button>
                        <button 
                          className="oh-profile-cancel-btn"
                          onClick={handlePersonalCancel}
                          disabled={isLoading}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-field-group">
                    {/* Basic Information */}
                    <div className="oh-profile-field">
                      <label>Employee ID</label>
                      <span>{personalFormData.employeeId}</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>First Name</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.firstName}</span>
                      ) : (
                        <input
                          type="text"
                          value={personalFormData.firstName}
                          onChange={(e) => setPersonalFormData({...personalFormData, firstName: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Last Name</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.lastName}</span>
                      ) : (
                        <input
                          type="text"
                          value={personalFormData.lastName}
                          onChange={(e) => setPersonalFormData({...personalFormData, lastName: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    
                    {/* Contact Information */}
                    <div className="oh-profile-field">
                      <label>Email</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.email}</span>
                      ) : (
                        <input
                          type="email"
                          value={personalFormData.email}
                          onChange={(e) => setPersonalFormData({...personalFormData, email: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Phone</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.phone}</span>
                      ) : (
                        <input
                          type="tel"
                          value={personalFormData.phone}
                          onChange={(e) => setPersonalFormData({...personalFormData, phone: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    
                    {/* Personal Details */}
                    <div className="oh-profile-field">
                      <label>Date of Birth</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.dateOfBirth}</span>
                      ) : (
                        <input
                          type="date"
                          value={personalFormData.dateOfBirth}
                          onChange={(e) => setPersonalFormData({...personalFormData, dateOfBirth: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Gender</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.gender}</span>
                      ) : (
                        <select
                          value={personalFormData.gender}
                          onChange={(e) => setPersonalFormData({...personalFormData, gender: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Marital Status</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.maritalStatus}</span>
                      ) : (
                        <select
                          value={personalFormData.maritalStatus}
                          onChange={(e) => setPersonalFormData({...personalFormData, maritalStatus: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Separated">Separated</option>
                        </select>
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Children</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.children}</span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          value={personalFormData.children}
                          onChange={(e) => setPersonalFormData({ ...personalFormData, children: e.target.value.replace(/[^\d]/g, '') })}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    
                    {/* Address Information */}
                    <div className="oh-profile-field">
                      <label>Address</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.address}</span>
                      ) : (
                        <textarea
                          value={personalFormData.address}
                          onChange={(e) => setPersonalFormData({...personalFormData, address: e.target.value})}
                          className="oh-profile-textarea"
                          rows={2}
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>City</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.city}</span>
                      ) : (
                        <input
                          type="text"
                          value={personalFormData.city}
                          onChange={(e) => setPersonalFormData({...personalFormData, city: e.target.value})}
                          className="oh-profile-input"
                          placeholder="Enter city"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>State</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.state}</span>
                      ) : (
                        <input
                          type="text"
                          value={personalFormData.state}
                          onChange={(e) => setPersonalFormData({...personalFormData, state: e.target.value})}
                          className="oh-profile-input"
                          placeholder="Enter state/province"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Country</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.country}</span>
                      ) : (
                        <select
                          value={personalFormData.country}
                          onChange={(e) => setPersonalFormData({...personalFormData, country: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="India">India</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>
                    
                    {/* Professional Information */}
                    <div className="oh-profile-field">
                      <label>Qualification</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.qualification}</span>
                      ) : (
                        <select
                          value={personalFormData.qualification}
                          onChange={(e) => setPersonalFormData({...personalFormData, qualification: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="">Select Qualification</option>
                          <option value="High School">High School</option>
                          <option value="Associate Degree">Associate Degree</option>
                          <option value="Bachelor of Arts">Bachelor of Arts</option>
                          <option value="Bachelor of Science">Bachelor of Science</option>
                          <option value="Bachelor of Computer Science">Bachelor of Computer Science</option>
                          <option value="Bachelor of Engineering">Bachelor of Engineering</option>
                          <option value="Master of Arts">Master of Arts</option>
                          <option value="Master of Science">Master of Science</option>
                          <option value="Master of Business Administration">Master of Business Administration</option>
                          <option value="Master of Computer Science">Master of Computer Science</option>
                          <option value="Doctor of Philosophy">Doctor of Philosophy</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Experience (years)</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.experience}</span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          value={personalFormData.experience}
                          onChange={(e) => setPersonalFormData({ ...personalFormData, experience: e.target.value.replace(/[^\d]/g, '') })}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    
                    {/* Emergency Contact Information */}
                    <div className="oh-profile-field">
                      <label>Emergency Contact Name</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.emergencyContactName}</span>
                      ) : (
                        <input
                          type="text"
                          value={personalFormData.emergencyContactName}
                          onChange={(e) => setPersonalFormData({...personalFormData, emergencyContactName: e.target.value})}
                          className="oh-profile-input"
                          placeholder="Enter emergency contact name"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Emergency Contact</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.emergencyContact}</span>
                      ) : (
                        <input
                          type="tel"
                          value={personalFormData.emergencyContact}
                          onChange={(e) => setPersonalFormData({...personalFormData, emergencyContact: e.target.value})}
                          className="oh-profile-input"
                          placeholder="Enter emergency contact number"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Emergency Contact Relation</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.emergencyContactRelation}</span>
                      ) : (
                        <select
                          value={personalFormData.emergencyContactRelation}
                          onChange={(e) => setPersonalFormData({...personalFormData, emergencyContactRelation: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="">Select Relation</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                          <option value="Child">Child</option>
                          <option value="Friend">Friend</option>
                          <option value="Relative">Relative</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Work Information</h3>
                  <div className="oh-profile-card-actions">
                    {!isEditingWork ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="oh-profile-edit-btn-small"
                          onClick={() => setIsEditingWork(true)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        {workFormData && workFormData.id && (
                          <button 
                            className="oh-profile-delete-btn"
                            onClick={handleWorkDelete}
                            style={{ 
                              backgroundColor: '#dc3545', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '4px', 
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="oh-profile-edit-actions">
                        <button 
                          className="oh-profile-save-btn"
                          onClick={handleWorkSave}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="oh-loading-spinner"></div>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                          Save
                        </button>
                        <button 
                          className="oh-profile-cancel-btn"
                          onClick={handleWorkCancel}
                          disabled={isLoading}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="oh-profile-card-body">
                  {workFormData ? (
                    <div className="oh-profile-field-group">
                      <div className="oh-profile-field">
                        <label>Location</label>
                        {!isEditingWork ? (
                          <span>{workFormData.location || 'Not specified'}</span>
                        ) : (
                          <input
                            type="text"
                            value={workFormData.location || ''}
                            onChange={(e) => setWorkFormData({...workFormData, location: e.target.value || null})}
                            className="oh-profile-input"
                            placeholder="Enter work location"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Work Email</label>
                        {!isEditingWork ? (
                          <span>{workFormData.email || 'Not specified'}</span>
                        ) : (
                          <input
                            type="email"
                            value={workFormData.email || ''}
                            onChange={(e) => setWorkFormData({...workFormData, email: e.target.value || null})}
                            className="oh-profile-input"
                            placeholder="Enter work email"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Work Mobile</label>
                        {!isEditingWork ? (
                          <span>{workFormData.mobile || 'Not specified'}</span>
                        ) : (
                          <input
                            type="tel"
                            value={workFormData.mobile || ''}
                            onChange={(e) => setWorkFormData({...workFormData, mobile: e.target.value || null})}
                            className="oh-profile-input"
                            placeholder="Enter work mobile"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Date of Joining</label>
                        {!isEditingWork ? (
                          <span>{workFormData.date_joining || 'Not specified'}</span>
                        ) : (
                          <input
                            type="date"
                            value={workFormData.date_joining || ''}
                            onChange={(e) => setWorkFormData({...workFormData, date_joining: e.target.value || null})}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Contract End Date</label>
                        {!isEditingWork ? (
                          <span>{workFormData.contract_end_date || 'Not specified'}</span>
                        ) : (
                          <input
                            type="date"
                            value={workFormData.contract_end_date || ''}
                            onChange={(e) => setWorkFormData({...workFormData, contract_end_date: e.target.value || null})}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Basic Salary</label>
                        {!isEditingWork ? (
                          <span>{workFormData.basic_salary}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.basic_salary}
                            onChange={(e) => setWorkFormData({...workFormData, basic_salary: parseFloat(e.target.value) || 0})}
                            className="oh-profile-input"
                            placeholder="Enter basic salary"
                            min="0"
                            step="0.01"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Salary per Hour</label>
                        {!isEditingWork ? (
                          <span>{workFormData.salary_hour}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.salary_hour}
                            onChange={(e) => setWorkFormData({...workFormData, salary_hour: parseFloat(e.target.value) || 0})}
                            className="oh-profile-input"
                            placeholder="Enter hourly salary"
                            min="0"
                            step="0.01"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Experience (Years)</label>
                        {!isEditingWork ? (
                          <span>{workFormData.experience}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.experience}
                            onChange={(e) => setWorkFormData({...workFormData, experience: parseFloat(e.target.value) || 0})}
                            className="oh-profile-input"
                            placeholder="Enter years of experience"
                            min="0"
                            step="0.1"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Department ID</label>
                        {!isEditingWork ? (
                          <span>{workFormData.department_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.department_id || ''}
                            onChange={(e) => setWorkFormData({...workFormData, department_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter department ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Job Position ID</label>
                        {!isEditingWork ? (
                          <span>{workFormData.job_position_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.job_position_id || ''}
                            onChange={(e) => setWorkFormData({...workFormData, job_position_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter job position ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Job Role ID</label>
                        {!isEditingWork ? (
                          <span>{workFormData.job_role_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.job_role_id || ''}
                            onChange={(e) => setWorkFormData({...workFormData, job_role_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter job role ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Reporting Manager ID</label>
                        {!isEditingWork ? (
                          <span>{workFormData.reporting_manager_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.reporting_manager_id || ''}
                            onChange={(e) => setWorkFormData({...workFormData, reporting_manager_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter reporting manager ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Shift ID</label>
                        {!isEditingWork ? (
                          <span>{workFormData.shift_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.shift_id || ''}
                            onChange={(e) => setWorkFormData({...workFormData, shift_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter shift ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Work Type ID</label>
                        {!isEditingWork ? (
                          <span>{workFormData.work_type_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.work_type_id || ''}
                            onChange={(e) => setWorkFormData({...workFormData, work_type_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter work type ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Employee Type ID</label>
                        {!isEditingWork ? (
                          <span>{workFormData.employee_type_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.employee_type_id || ''}
                            onChange={(e) => setWorkFormData({...workFormData, employee_type_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter employee type ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Company ID</label>
                        {!isEditingWork ? (
                          <span>{workFormData.company_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={workFormData.company_id || ''}
                            onChange={(e) => setWorkFormData({...workFormData, company_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter company ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Tags</label>
                        {!isEditingWork ? (
                          <span>{workFormData.tags && workFormData.tags.length > 0 ? workFormData.tags.join(', ') : 'Not specified'}</span>
                        ) : (
                          <input
                            type="text"
                            value={workFormData.tags ? workFormData.tags.join(', ') : ''}
                            onChange={(e) => setWorkFormData({...workFormData, tags: e.target.value ? e.target.value.split(',').map(tag => tag.trim()) : []})}
                            className="oh-profile-input"
                            placeholder="Enter tags separated by commas"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Additional Information</label>
                        {!isEditingWork ? (
                          <span>{workFormData.additional_info || 'Not specified'}</span>
                        ) : (
                          <textarea
                            value={workFormData.additional_info || ''}
                            onChange={(e) => setWorkFormData({...workFormData, additional_info: e.target.value || null})}
                            className="oh-profile-input"
                            placeholder="Enter additional information"
                            rows={3}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="oh-profile-field-group">
                      <p>No work information available. Click Edit to add work details.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bank Information Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Bank Information</h3>
                  <div className="oh-profile-card-actions">
                    {!isEditingBank ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="oh-profile-edit-btn-small"
                          onClick={() => setIsEditingBank(true)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </button>
                        {bankFormData && bankFormData.id && (
                          <button 
                            className="oh-profile-delete-btn"
                            onClick={handleBankDelete}
                            style={{ 
                              backgroundColor: '#dc3545', 
                              color: 'white', 
                              border: 'none', 
                              padding: '6px 12px', 
                              borderRadius: '4px', 
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3,6 5,6 21,6"></polyline>
                              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                            </svg>
                            Delete
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="oh-profile-edit-actions">
                        <button 
                          className="oh-profile-save-btn"
                          onClick={handleBankSave}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="oh-loading-spinner"></div>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                          Save
                        </button>
                        <button 
                          className="oh-profile-cancel-btn"
                          onClick={handleBankCancel}
                          disabled={isLoading}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="oh-profile-card-body">
                  {!bankFormData ? (
                    <div className="oh-profile-empty-state">
                      <p>No bank details found.</p>
                      <button 
                        className="oh-profile-add-btn"
                        onClick={() => {
                          setBankFormData({
                            id: null,
                            bankName: '',
                            accountNumber: '',
                            branch: '',
                            address: '',
                            country: '',
                            state: '',
                            city: '',
                            anyOtherCode1: '',
                            anyOtherCode2: '',
                            additionalInfo: '',
                            employeeId: null,
                            isActive: true
                          });
                          setIsEditingBank(true);
                        }}
                      >
                        Add Bank Details
                      </button>
                    </div>
                  ) : (
                    <div className="oh-profile-field-group">
                      <div className="oh-profile-field">
                        <label>Bank Name</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.bankName || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={bankFormData.bankName || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              bankName: e.target.value
                            })}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Account Number</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.accountNumber || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={bankFormData.accountNumber || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              accountNumber: e.target.value
                            })}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Branch</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.branch || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={bankFormData.branch || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              branch: e.target.value
                            })}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Bank Code #1</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.anyOtherCode1 || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={bankFormData.anyOtherCode1 || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              anyOtherCode1: e.target.value
                            })}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Bank Code #2</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.anyOtherCode2 || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={bankFormData.anyOtherCode2 || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              anyOtherCode2: e.target.value
                            })}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Bank Country</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.country || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={bankFormData.country || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              country: e.target.value
                            })}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Bank State</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.state || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={bankFormData.state || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              state: e.target.value
                            })}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Bank City</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.city || '-'}</span>
                        ) : (
                          <input
                            type="text"
                            value={bankFormData.city || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              city: e.target.value
                            })}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Address</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.address || '-'}</span>
                        ) : (
                          <textarea
                            value={bankFormData.address || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              address: e.target.value
                            })}
                            className="oh-profile-input"
                            rows={3}
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Additional Information</label>
                        {!isEditingBank ? (
                          <span>{bankFormData.additionalInfo || '-'}</span>
                        ) : (
                          <textarea
                            value={bankFormData.additionalInfo || ''}
                            onChange={(e) => setBankFormData({
                              ...bankFormData,
                              additionalInfo: e.target.value
                            })}
                            className="oh-profile-input"
                            rows={3}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contract Details Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Contract Details</h3>
                  <div className="oh-profile-card-actions">
                    {!isEditingContract ? (
                      <button 
                        className="oh-profile-edit-btn-small"
                        onClick={() => {
                          if (!contractFormData) {
                            // Initialize with default values if no contract exists
                            setContractFormData({
                              id: undefined,
                              contract: '',
                              employee_id: personalFormData?.id || 0,
                              contract_start_date: '',
                              contract_end_date: '',
                              wage_type: '',
                              pay_frequency: '',
                              basic_salary: 0,
                              filing_status: '',
                              department_id: null,
                              job_position_id: null,
                              job_role_id: null,
                              shift_id: null,
                              work_type_id: null,
                              notice_period: 0,
                              contract_document: null,
                              deduct_from_basic_pay: false,
                              calculate_daily_leave_amount_pay: false,
                              note: ''
                            });
                          }
                          setIsEditingContract(true);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                    ) : (
                      <div className="oh-profile-edit-actions">
                        <button 
                          className="oh-profile-save-btn"
                          onClick={handleContractSave}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="oh-loading-spinner"></div>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                          Save
                        </button>
                        <button 
                          className="oh-profile-cancel-btn"
                          onClick={handleContractCancel}
                          disabled={isLoading}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="oh-profile-card-body">
                  {!contractFormData ? (
                    <div className="oh-profile-empty-state">
                      <p>No contract details available</p>
                    </div>
                  ) : (
                    <div className="oh-profile-field-group">
                      <div className="oh-profile-field">
                        <label>Contract</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.contract || 'Not specified'}</span>
                        ) : (
                          <input
                            type="text"
                            value={contractFormData.contract || ''}
                            onChange={(e) => setContractFormData({...contractFormData, contract: e.target.value})}
                            className="oh-profile-input"
                            placeholder="Enter contract name"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Contract Start Date</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.contract_start_date || 'Not specified'}</span>
                        ) : (
                          <input
                            type="date"
                            value={contractFormData.contract_start_date || ''}
                            onChange={(e) => setContractFormData({...contractFormData, contract_start_date: e.target.value})}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Contract End Date</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.contract_end_date || 'Not specified'}</span>
                        ) : (
                          <input
                            type="date"
                            value={contractFormData.contract_end_date || ''}
                            onChange={(e) => setContractFormData({...contractFormData, contract_end_date: e.target.value})}
                            className="oh-profile-input"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Wage Type</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.wage_type || 'Not specified'}</span>
                        ) : (
                          <select
                            value={contractFormData.wage_type || ''}
                            onChange={(e) => setContractFormData({...contractFormData, wage_type: e.target.value})}
                            className="oh-profile-select"
                          >
                            <option value="">Select wage type</option>
                            <option value="hourly">Hourly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </select>
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Pay Frequency</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.pay_frequency || 'Not specified'}</span>
                        ) : (
                          <select
                            value={contractFormData.pay_frequency || ''}
                            onChange={(e) => setContractFormData({...contractFormData, pay_frequency: e.target.value})}
                            className="oh-profile-select"
                          >
                            <option value="">Select pay frequency</option>
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-weekly</option>
                            <option value="monthly">Monthly</option>
                          </select>
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Basic Salary</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.basic_salary || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={contractFormData.basic_salary || ''}
                            onChange={(e) => setContractFormData({...contractFormData, basic_salary: e.target.value ? parseFloat(e.target.value) : 0})}
                            className="oh-profile-input"
                            placeholder="Enter basic salary"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Filing Status</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.filing_status || 'Not specified'}</span>
                        ) : (
                          <input
                            type="text"
                            value={contractFormData.filing_status || ''}
                            onChange={(e) => setContractFormData({...contractFormData, filing_status: e.target.value})}
                            className="oh-profile-input"
                            placeholder="Enter filing status"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Department ID</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.department_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={contractFormData.department_id || ''}
                            onChange={(e) => setContractFormData({...contractFormData, department_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter department ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Job Position ID</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.job_position_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={contractFormData.job_position_id || ''}
                            onChange={(e) => setContractFormData({...contractFormData, job_position_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter job position ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Job Role ID</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.job_role_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={contractFormData.job_role_id || ''}
                            onChange={(e) => setContractFormData({...contractFormData, job_role_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter job role ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Shift ID</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.shift_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={contractFormData.shift_id || ''}
                            onChange={(e) => setContractFormData({...contractFormData, shift_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter shift ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Work Type ID</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.work_type_id || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={contractFormData.work_type_id || ''}
                            onChange={(e) => setContractFormData({...contractFormData, work_type_id: e.target.value ? parseInt(e.target.value) : null})}
                            className="oh-profile-input"
                            placeholder="Enter work type ID"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Notice Period</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.notice_period || 'Not specified'}</span>
                        ) : (
                          <input
                            type="number"
                            value={contractFormData.notice_period || ''}
                            onChange={(e) => setContractFormData({...contractFormData, notice_period: e.target.value ? parseInt(e.target.value) : 0})}
                            className="oh-profile-input"
                            placeholder="Enter notice period (days)"
                          />
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Deduct From Basic Pay</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.deduct_from_basic_pay ? 'Yes' : 'No'}</span>
                        ) : (
                          <label className="oh-profile-checkbox">
                            <input
                              type="checkbox"
                              checked={contractFormData.deduct_from_basic_pay || false}
                              onChange={(e) => setContractFormData({...contractFormData, deduct_from_basic_pay: e.target.checked})}
                            />
                            <span className="checkmark"></span>
                            Enable deduction from basic pay
                          </label>
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Calculate Daily Leave Amount Pay</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.calculate_daily_leave_amount_pay ? 'Yes' : 'No'}</span>
                        ) : (
                          <label className="oh-profile-checkbox">
                            <input
                              type="checkbox"
                              checked={contractFormData.calculate_daily_leave_amount_pay || false}
                              onChange={(e) => setContractFormData({...contractFormData, calculate_daily_leave_amount_pay: e.target.checked})}
                            />
                            <span className="checkmark"></span>
                            Calculate daily leave amount pay
                          </label>
                        )}
                      </div>
                      <div className="oh-profile-field">
                        <label>Note</label>
                        {!isEditingContract ? (
                          <span>{contractFormData.note || 'Not specified'}</span>
                        ) : (
                          <textarea
                            value={contractFormData.note || ''}
                            onChange={(e) => setContractFormData({...contractFormData, note: e.target.value})}
                            className="oh-profile-textarea"
                            placeholder="Enter additional notes"
                            rows={3}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'work-type-shift':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Work Type Requests Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Work type request</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-empty-state">
                    <p>No work type request has been created.</p>
                  </div>
                </div>
              </div>

              {/* Rotating Work Type Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Rotating work type</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-empty-state">
                    <p>No rotating work type has been assigned.</p>
                  </div>
                </div>
              </div>

              {/* Shift Request Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Shift request</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-empty-state">
                    <p>No shift request has been created.</p>
                  </div>
                </div>
              </div>

              {/* Rotating Shift Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Rotating Shift</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-empty-state">
                    <p>No rotating shift has been assigned.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Attendance Overview Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Attendance Overview</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-field-group">
                    <div className="oh-profile-field">
                      <label>Total Working Days</label>
                      <span>22</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Present Days</label>
                      <span>20</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Absent Days</label>
                      <span>2</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Late Arrivals</label>
                      <span>3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Attendance Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Recent Attendance</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-attendance-list">
                    <div className="oh-profile-attendance-item">
                      <span className="date">2025-08-02</span>
                      <span className="time">09:00 AM - 06:00 PM</span>
                      <span className="status present">Present</span>
                    </div>
                    <div className="oh-profile-attendance-item">
                      <span className="date">2025-08-01</span>
                      <span className="time">09:15 AM - 06:00 PM</span>
                      <span className="status late">Late</span>
                    </div>
                    <div className="oh-profile-attendance-item">
                      <span className="date">2025-07-31</span>
                      <span className="time">-</span>
                      <span className="status absent">Absent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Personal Documents Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Personal Documents</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-document-list">
                    <div className="oh-profile-document-item">
                      <span className="document-name">Resume.pdf</span>
                      <span className="document-date">Uploaded: 2020-03-10</span>
                      <button className="document-download">Download</button>
                    </div>
                    <div className="oh-profile-document-item">
                      <span className="document-name">ID_Proof.pdf</span>
                      <span className="document-date">Uploaded: 2020-03-10</span>
                      <button className="document-download">Download</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Documents Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Official Documents</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-document-list">
                    <div className="oh-profile-document-item">
                      <span className="document-name">Employment_Contract.pdf</span>
                      <span className="document-date">Generated: 2020-03-15</span>
                      <button className="document-download">Download</button>
                    </div>
                    <div className="oh-profile-document-item">
                      <span className="document-name">Offer_Letter.pdf</span>
                      <span className="document-date">Generated: 2020-03-10</span>
                      <button className="document-download">Download</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'leave':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Leave Balance Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Leave Balance</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-field-group">
                    <div className="oh-profile-field">
                      <label>Annual Leave</label>
                      <span>15 / 25 days</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Sick Leave</label>
                      <span>5 / 10 days</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Personal Leave</label>
                      <span>2 / 5 days</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Maternity Leave</label>
                      <span>0 / 90 days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Leave Requests Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Recent Leave Requests</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-leave-list">
                    <div className="oh-profile-leave-item">
                      <span className="leave-type">Annual Leave</span>
                      <span className="leave-dates">Aug 10-12, 2025</span>
                      <span className="leave-status pending">Pending</span>
                    </div>
                    <div className="oh-profile-leave-item">
                      <span className="leave-type">Sick Leave</span>
                      <span className="leave-dates">Jul 28, 2025</span>
                      <span className="leave-status approved">Approved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'payroll':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Salary Information Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Salary Information</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-field-group">
                    <div className="oh-profile-field">
                      <label>Basic Salary</label>
                      <span>$60,000</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>House Rent Allowance</label>
                      <span>$12,000</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Transport Allowance</label>
                      <span>$3,000</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Gross Salary</label>
                      <span>$75,000</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Payslips Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Recent Payslips</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-payslip-list">
                    <div className="oh-profile-payslip-item">
                      <span className="payslip-period">August 2025</span>
                      <span className="payslip-amount">$6,250</span>
                      <button className="document-download">Download</button>
                    </div>
                    <div className="oh-profile-payslip-item">
                      <span className="payslip-period">July 2025</span>
                      <span className="payslip-amount">$6,250</span>
                      <button className="document-download">Download</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'allowance-deduction':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Allowances Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Allowances</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-allowance-list">
                    <div className="oh-profile-allowance-item">
                      <span className="allowance-name">Transport Allowance</span>
                      <span className="allowance-amount">$250/month</span>
                      <span className="allowance-status active">Active</span>
                    </div>
                    <div className="oh-profile-allowance-item">
                      <span className="allowance-name">Meal Allowance</span>
                      <span className="allowance-amount">$200/month</span>
                      <span className="allowance-status active">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Deductions</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-deduction-list">
                    <div className="oh-profile-deduction-item">
                      <span className="deduction-name">Health Insurance</span>
                      <span className="deduction-amount">$150/month</span>
                      <span className="deduction-status active">Active</span>
                    </div>
                    <div className="oh-profile-deduction-item">
                      <span className="deduction-name">Provident Fund</span>
                      <span className="deduction-amount">$500/month</span>
                      <span className="deduction-status active">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'penalty-account':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Penalty Records Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Penalty Records</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-empty-state">
                    <p>No penalty records found.</p>
                  </div>
                </div>
              </div>

              {/* Fine History Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Fine History</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-empty-state">
                    <p>No fines have been imposed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'assets':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Assigned Assets Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Assigned Assets</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-asset-list">
                    <div className="oh-profile-asset-item">
                      <span className="asset-name">MacBook Pro 16"</span>
                      <span className="asset-id">ASSET-001</span>
                      <span className="asset-status assigned">Assigned</span>
                    </div>
                    <div className="oh-profile-asset-item">
                      <span className="asset-name">iPhone 13</span>
                      <span className="asset-id">ASSET-002</span>
                      <span className="asset-status assigned">Assigned</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Asset Requests Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Asset Requests</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-empty-state">
                    <p>No asset requests found.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Performance Reviews Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Performance Reviews</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-review-list">
                    <div className="oh-profile-review-item">
                      <span className="review-period">Q2 2025</span>
                      <span className="review-score">4.5/5.0</span>
                      <span className="review-status completed">Completed</span>
                    </div>
                    <div className="oh-profile-review-item">
                      <span className="review-period">Q1 2025</span>
                      <span className="review-score">4.2/5.0</span>
                      <span className="review-status completed">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals & Objectives Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Goals & Objectives</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-goal-list">
                    <div className="oh-profile-goal-item">
                      <span className="goal-title">Complete React Training</span>
                      <span className="goal-deadline">Due: Sep 30, 2025</span>
                      <span className="goal-status in-progress">In Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'bonus-points':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Bonus Points Summary Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Bonus Points Summary</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-field-group">
                    <div className="oh-profile-field">
                      <label>Total Points Earned</label>
                      <span>1,250 points</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Points Redeemed</label>
                      <span>300 points</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Available Balance</label>
                      <span>950 points</span>
                    </div>
                    <div className="oh-profile-field">
                      <label>Current Level</label>
                      <span>Gold</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Bonus Activities Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Recent Activities</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-bonus-list">
                    <div className="oh-profile-bonus-item">
                      <span className="bonus-activity">Project Completion Bonus</span>
                      <span className="bonus-points">+100 points</span>
                      <span className="bonus-date">Aug 1, 2025</span>
                    </div>
                    <div className="oh-profile-bonus-item">
                      <span className="bonus-activity">Attendance Bonus</span>
                      <span className="bonus-points">+50 points</span>
                      <span className="bonus-date">Jul 31, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'scheduled-interview':
        return (
          <div className="oh-profile-content">
            <div className="oh-profile-cards-grid">
              {/* Upcoming Interviews Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Upcoming Interviews</h3>
                  <button className="oh-profile-add-btn">+</button>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-empty-state">
                    <p>No upcoming interviews scheduled.</p>
                  </div>
                </div>
              </div>

              {/* Interview History Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Interview History</h3>
                </div>
                <div className="oh-profile-card-body">
                  <div className="oh-profile-interview-list">
                    <div className="oh-profile-interview-item">
                      <span className="interview-type">Technical Interview</span>
                      <span className="interview-date">Mar 10, 2020</span>
                      <span className="interview-status completed">Completed</span>
                    </div>
                    <div className="oh-profile-interview-item">
                      <span className="interview-type">HR Interview</span>
                      <span className="interview-date">Mar 12, 2020</span>
                      <span className="interview-status completed">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="oh-app-layout">
      <Sidebar />
      <div className={`oh-main-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <div className="oh-profile-container">
          <div className="oh-profile-header">
            <div className="oh-profile-header-info">
              <div className="oh-profile-avatar">
                <img 
                  src={`https://ui-avatars.com/api/?name=${personalFormData?.firstName}+${personalFormData?.lastName}&background=007bff&color=fff`} 
                  alt={`${personalFormData?.firstName} ${personalFormData?.lastName}`}
                />
              </div>
              <div className="oh-profile-details">
                <h1>{personalFormData?.firstName} {personalFormData?.lastName}</h1>
                <p>{personalFormData?.position}  {personalFormData?.department}</p>
                <p>{personalFormData?.email}</p>
                {hasUnsavedChanges() && (
                  <div className="oh-edit-mode-indicator">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    <span>Edit Mode Active</span>
                  </div>
                )}
              </div>
              <div className="oh-profile-actions">
                <button 
                  className="oh-profile-edit-btn"
                  onClick={() => handleTabEdit('about')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  {hasUnsavedChanges() ? 
                    `Editing (${[isEditingPersonal, isEditingWork, isEditingBank, isEditingContract].filter(Boolean).length} sections)` : 
                    'Edit Profile'
                  }
                </button>
                {hasUnsavedChanges() && (
                  <button 
                    className="oh-profile-view-btn"
                    onClick={handleCancelAllChanges}
                    disabled={isLoading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    View Mode
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="oh-profile-tabs">
            <button 
              className={`oh-profile-tab ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('about')}
            >
              About
              {activeTab !== 'about' && (
                <span 
                  className="oh-tab-edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabEdit('about');
                  }}
                  title="Edit this section"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </span>
              )}
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'work-type-shift' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('work-type-shift')}
            >
              Work Type & Shift
              {activeTab !== 'work-type-shift' && (
                <span 
                  className="oh-tab-edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabEdit('work-type-shift');
                  }}
                  title="Edit this section"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </span>
              )}
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              Attendance
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'leave' ? 'active' : ''}`}
              onClick={() => setActiveTab('leave')}
            >
              Leave
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'payroll' ? 'active' : ''}`}
              onClick={() => setActiveTab('payroll')}
            >
              Payroll
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'allowance-deduction' ? 'active' : ''}`}
              onClick={() => setActiveTab('allowance-deduction')}
            >
              Allowance & Deduction
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'penalty-account' ? 'active' : ''}`}
              onClick={() => setActiveTab('penalty-account')}
            >
              Penalty Account
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'assets' ? 'active' : ''}`}
              onClick={() => setActiveTab('assets')}
            >
              Assets
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
              {activeTab !== 'documents' && (
                <span 
                  className="oh-tab-edit-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTabEdit('documents');
                  }}
                  title="Edit this section"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </span>
              )}
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'bonus-points' ? 'active' : ''}`}
              onClick={() => setActiveTab('bonus-points')}
            >
              Bonus Points
            </button>
            <button 
              className={`oh-profile-tab ${activeTab === 'scheduled-interview' ? 'active' : ''}`}
              onClick={() => setActiveTab('scheduled-interview')}
            >
              Scheduled Interview
            </button>
          </div>

          {renderTabContent()}
        </div>
      </div>
      <QuickAccess />
      
      {/* Save All Changes Floating Bar */}
      {hasUnsavedChanges() && (
        <div className="oh-save-all-bar">
          <div className="oh-save-all-content">
            <div className="oh-save-all-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>You have unsaved changes in {
                [
                  isEditingPersonal && 'Personal Info',
                  isEditingWork && 'Work Info', 
                  isEditingBank && 'Bank Info',
                  isEditingContract && 'Contract Details'
                ].filter(Boolean).join(', ')
              }</span>
            </div>
            <div className="oh-save-all-actions">
              <button 
                className="oh-save-all-cancel"
                onClick={handleCancelAllChanges}
                disabled={isLoading}
              >
                Cancel All
              </button>
              <button 
                className="oh-save-all-btn"
                onClick={handleSaveAllChanges}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="oh-loading-spinner"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="oh-modal-overlay">
          <div className="oh-confirm-dialog">
            <div className="oh-confirm-header">
              <h4>Unsaved Changes</h4>
            </div>
            <div className="oh-confirm-body">
              <p>You have unsaved changes. Are you sure you want to leave this section? All unsaved changes will be lost.</p>
            </div>
            <div className="oh-confirm-footer">
              <button 
                className="oh-btn-secondary"
                onClick={cancelTabSwitch}
              >
                Cancel
              </button>
              <button 
                className="oh-btn-danger"
                onClick={confirmTabSwitch}
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Toast */}
      {showNotification && (
        <div className={`oh-notification oh-notification-${notificationType}`}>
          <div className="oh-notification-content">
            <div className="oh-notification-icon">
              {notificationType === 'success' && (
                <svg width="20" height="20" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              )}
              {notificationType === 'error' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              )}
              {notificationType === 'info' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
            </div>
            <span className="oh-notification-message">{notificationMessage}</span>
            <button 
              className="oh-notification-close"
              onClick={() => setShowNotification(false)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfile;



