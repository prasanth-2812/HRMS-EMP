import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Layout/Sidebar';
import Navbar from '../../../components/Layout/Navbar';
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
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  branch: string;
}

const EmployeeProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingWork, setIsEditingWork] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isEditingContract, setIsEditingContract] = useState(false);
  const [personalFormData, setPersonalFormData] = useState<EmployeeProfileData | null>(null);
  const [bankFormData, setBankFormData] = useState<BankInfo | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<string>('');
  const { isCollapsed } = useSidebar();
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

  useEffect(() => {
    setIsLoading(true);
    apiClient.get('/api/v1/auth/profile/')
      .then((res) => {
        const data = res.data;
        setPersonalFormData(mapApiToProfileData(data));
        setBankFormData(null); // No bank info in API
        setFetchError(null);
      })
      .catch((err) => {
        setFetchError(err.message || 'Failed to fetch profile');
      })
      .finally(() => setIsLoading(false));
  }, []);

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
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to save the data
      console.log('Saving personal data:', personalFormData);
      
      setIsEditingPersonal(false);
      showNotificationMessage('Personal information updated successfully!');
    } catch (error) {
      showNotificationMessage('Failed to update personal information. Please try again.', 'error');
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
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to save the data
      console.log('Saving bank data:', bankFormData);
      
      setIsEditingBank(false);
      showNotificationMessage('Bank information updated successfully!');
    } catch (error) {
      showNotificationMessage('Failed to update bank information. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankCancel = () => {
    setBankFormData(null);
    setIsEditingBank(false);
    showNotificationMessage('Changes discarded', 'info');
  };

  const handleWorkSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving work data:', personalFormData);
      
      setIsEditingWork(false);
      showNotificationMessage('Work information updated successfully!');
    } catch (error) {
      showNotificationMessage('Failed to update work information. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkCancel = () => {
    setPersonalFormData(null);
    setIsEditingWork(false);
    showNotificationMessage('Changes discarded', 'info');
  };

  const handleContractSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving contract data:', personalFormData);
      
      setIsEditingContract(false);
      showNotificationMessage('Contract details updated successfully!');
    } catch (error) {
      showNotificationMessage('Failed to update contract details. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContractCancel = () => {
    setPersonalFormData(null);
    setIsEditingContract(false);
    showNotificationMessage('Changes discarded', 'info');
  };

  const handleSaveAllChanges = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls for all sections
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save all data
      console.log('Saving all data:', {
        personal: personalFormData,
        bank: bankFormData
      });
      
      // Reset all edit states
      setIsEditingPersonal(false);
      setIsEditingWork(false);
      setIsEditingBank(false);
      setIsEditingContract(false);
      
      showNotificationMessage('All changes saved successfully!');
    } catch (error) {
      showNotificationMessage('Failed to save some changes. Please try again.', 'error');
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
                        <select
                          value={personalFormData.children}
                          onChange={(e) => setPersonalFormData({...personalFormData, children: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="0">0</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5+">5+</option>
                        </select>
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
                      <label>Experience</label>
                      {!isEditingPersonal ? (
                        <span>{personalFormData.experience}</span>
                      ) : (
                        <select
                          value={personalFormData.experience}
                          onChange={(e) => setPersonalFormData({...personalFormData, experience: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="">Select Experience</option>
                          <option value="Fresh Graduate">Fresh Graduate</option>
                          <option value="1 year">1 year</option>
                          <option value="2 years">2 years</option>
                          <option value="3 years">3 years</option>
                          <option value="4 years">4 years</option>
                          <option value="5 years">5 years</option>
                          <option value="6-10 years">6-10 years</option>
                          <option value="11-15 years">11-15 years</option>
                          <option value="16-20 years">16-20 years</option>
                          <option value="20+ years">20+ years</option>
                        </select>
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
                  <div className="oh-profile-field-group">
                    <div className="oh-profile-field">
                      <label>Department</label>
                      {!isEditingWork ? (
                        <span>{personalFormData.department}</span>
                      ) : (
                        <select
                          value={personalFormData.department}
                          onChange={(e) => setPersonalFormData({...personalFormData, department: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                        </select>
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Position</label>
                      {!isEditingWork ? (
                        <span>{personalFormData.position}</span>
                      ) : (
                        <input
                          type="text"
                          value={personalFormData.position}
                          onChange={(e) => setPersonalFormData({...personalFormData, position: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Manager</label>
                      {!isEditingWork ? (
                        <span>{personalFormData.manager}</span>
                      ) : (
                        <input
                          type="text"
                          value={personalFormData.manager}
                          onChange={(e) => setPersonalFormData({...personalFormData, manager: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Date of Joining</label>
                      {!isEditingWork ? (
                        <span>{personalFormData.dateOfJoining}</span>
                      ) : (
                        <input
                          type="date"
                          value={personalFormData.dateOfJoining}
                          onChange={(e) => setPersonalFormData({...personalFormData, dateOfJoining: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Employment Type</label>
                      {!isEditingWork ? (
                        <span>{personalFormData.employmentType}</span>
                      ) : (
                        <select
                          value={personalFormData.employmentType}
                          onChange={(e) => setPersonalFormData({...personalFormData, employmentType: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Work Location</label>
                      {!isEditingWork ? (
                        <span>{personalFormData.workLocation}</span>
                      ) : (
                        <select
                          value={personalFormData.workLocation}
                          onChange={(e) => setPersonalFormData({...personalFormData, workLocation: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="Head Office">Head Office</option>
                          <option value="Branch Office">Branch Office</option>
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Information Card */}
              <div className="oh-profile-card">
                <div className="oh-profile-card-header">
                  <h3>Bank Information</h3>
                  <div className="oh-profile-card-actions">
                    {!isEditingBank ? (
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
                  <div className="oh-profile-field-group">
                    <div className="oh-profile-field">
                      <label>Bank Name</label>
                      {!isEditingBank ? (
                        <span>{bankFormData?.bankName}</span>
                      ) : (
                        <input
                          type="text"
                          value={bankFormData?.bankName}
                          onChange={(e) => bankFormData && setBankFormData({
                            bankName: e.target.value,
                            accountNumber: bankFormData.accountNumber ?? '',
                            routingNumber: bankFormData.routingNumber ?? '',
                            accountType: bankFormData.accountType ?? '',
                            branch: bankFormData.branch ?? ''
                          })}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Account Number</label>
                      {!isEditingBank ? (
                        <span>{bankFormData?.accountNumber}</span>
                      ) : (
                        <input
                          type="text"
                          value={bankFormData?.accountNumber}
                          onChange={(e) => bankFormData && setBankFormData({
                            bankName: bankFormData.bankName ?? '',
                            accountNumber: e.target.value,
                            routingNumber: bankFormData.routingNumber ?? '',
                            accountType: bankFormData.accountType ?? '',
                            branch: bankFormData.branch ?? ''
                          })}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Routing Number</label>
                      {!isEditingBank ? (
                        <span>{bankFormData?.routingNumber}</span>
                      ) : (
                        <input
                          type="text"
                          value={bankFormData?.routingNumber}
                          onChange={(e) => bankFormData && setBankFormData({
                            bankName: bankFormData.bankName ?? '',
                            accountNumber: bankFormData.accountNumber ?? '',
                            routingNumber: e.target.value,
                            accountType: bankFormData.accountType ?? '',
                            branch: bankFormData.branch ?? ''
                          })}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Account Type</label>
                      {!isEditingBank ? (
                        <span>{bankFormData?.accountType}</span>
                      ) : (
                        <select
                          value={bankFormData?.accountType}
                          onChange={(e) => bankFormData && setBankFormData({
                            bankName: bankFormData.bankName ?? '',
                            accountNumber: bankFormData.accountNumber ?? '',
                            routingNumber: bankFormData.routingNumber ?? '',
                            accountType: e.target.value,
                            branch: bankFormData.branch ?? ''
                          })}
                          className="oh-profile-select"
                        >
                          <option value="Checking">Checking</option>
                          <option value="Savings">Savings</option>
                        </select>
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Branch</label>
                      {!isEditingBank ? (
                        <span>{bankFormData?.branch}</span>
                      ) : (
                        <input
                          type="text"
                          value={bankFormData?.branch}
                          onChange={(e) => bankFormData && setBankFormData({
                            bankName: bankFormData.bankName ?? '',
                            accountNumber: bankFormData.accountNumber ?? '',
                            routingNumber: bankFormData.routingNumber ?? '',
                            accountType: bankFormData.accountType ?? '',
                            branch: e.target.value
                          })}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                  </div>
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
                        onClick={() => setIsEditingContract(true)}
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
                  <div className="oh-profile-field-group">
                    <div className="oh-profile-field">
                      <label>Salary</label>
                      {!isEditingContract ? (
                        <span>{personalFormData.salary}</span>
                      ) : (
                        <input
                          type="text"
                          value={personalFormData.salary}
                          onChange={(e) => setPersonalFormData({...personalFormData, salary: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Contract Start Date</label>
                      {!isEditingContract ? (
                        <span>{personalFormData.contractStartDate}</span>
                      ) : (
                        <input
                          type="date"
                          value={personalFormData.contractStartDate}
                          onChange={(e) => setPersonalFormData({...personalFormData, contractStartDate: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Contract End Date</label>
                      {!isEditingContract ? (
                        <span>{personalFormData.contractEndDate}</span>
                      ) : (
                        <input
                          type="date"
                          value={personalFormData.contractEndDate}
                          onChange={(e) => setPersonalFormData({...personalFormData, contractEndDate: e.target.value})}
                          className="oh-profile-input"
                        />
                      )}
                    </div>
                    <div className="oh-profile-field">
                      <label>Probation Period</label>
                      {!isEditingContract ? (
                        <span>{personalFormData.probationPeriod}</span>
                      ) : (
                        <select
                          value={personalFormData.probationPeriod}
                          onChange={(e) => setPersonalFormData({...personalFormData, probationPeriod: e.target.value})}
                          className="oh-profile-select"
                        >
                          <option value="3 months">3 months</option>
                          <option value="6 months">6 months</option>
                          <option value="12 months">12 months</option>
                        </select>
                      )}
                    </div>
                  </div>
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
        <Navbar pageTitle="Employee Profile" />
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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



