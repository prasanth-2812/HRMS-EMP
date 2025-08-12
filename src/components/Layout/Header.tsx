import React, { useState, useEffect } from 'react';
import './Header.css';
import useClickOutside from '../../hooks/useClickOutside';
import { useSidebar } from '../../contexts/SidebarContext';
import { useApi } from '../../hooks/useApi';
import { User } from '../../types/auth';

interface HeaderProps {
  toggleSidebar: () => void;
}

interface UserProfile extends User {
  profileImage?: string;
  department?: string;
  position?: string;
  company?: string;
}

interface Notification {
  id: string;
  text: string;
  date: string;
  icon: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

interface Company {
  id: string;
  name: string;
  logo?: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { isCollapsed } = useSidebar();
  
  // State management
  const [openNotification, setOpenNotification] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>({
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  });
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  
  // Modals state
  const [showChangeUsernameModal, setShowChangeUsernameModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // API calls
  const { data: userProfile, loading: userLoading, error: userError, refetch: refetchUser } = useApi<UserProfile>('/auth/me');
  const { data: notifications, loading: notificationsLoading, refetch: refetchNotifications } = useApi<Notification[]>('/notifications');
  const { data: companies, loading: companiesLoading } = useApi<Company[]>('/companies');
  const { data: attendanceStatus } = useApi<{ isCheckedIn: boolean }>('/attendance/status');

  // Click outside handlers
  const notificationRef = useClickOutside(() => setOpenNotification(false));
  const userDropdownRef = useClickOutside(() => setUserDropdownOpen(false));
  const languageDropdownRef = useClickOutside(() => setLanguageDropdownOpen(false));
  const companyDropdownRef = useClickOutside(() => setCompanyDropdownOpen(false));

  // Available languages
  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  // Mock notifications for fallback
  const mockNotifications: Notification[] = [
    {
      id: '1',
      text: "Your leave request has been approved.",
      date: "2 hours ago",
      icon: "checkmark-circle-outline",
      isRead: false,
      type: 'success'
    },
    {
      id: '2',
      text: "New policy update available.",
      date: "1 day ago",
      icon: "document-text-outline",
      isRead: false,
      type: 'info'
    },
    {
      id: '3',
      text: "Payroll processing completed.",
      date: "2 days ago",
      icon: "card-outline",
      isRead: true,
      type: 'success'
    },
    {
      id: '4',
      text: "Meeting reminder: Team standup at 10 AM.",
      date: "3 days ago",
      icon: "time-outline",
      isRead: true,
      type: 'warning'
    }
  ];

  // Effects
  useEffect(() => {
    if (attendanceStatus) {
      setIsCheckedIn(attendanceStatus.isCheckedIn);
    }
  }, [attendanceStatus]);

  useEffect(() => {
    if (companies && companies.length > 0 && !currentCompany) {
      setCurrentCompany(companies[0]);
    }
  }, [companies, currentCompany]);

  // Get display notifications
  const displayNotifications = notifications || mockNotifications;
  const unreadCount = displayNotifications.filter(n => !n.isRead).length;

  // Handler functions
  const handleCheckInOut = async () => {
    try {
      // API call to check in/out
      const response = await fetch('/api/attendance/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setIsCheckedIn(!isCheckedIn);
        // Optionally show success message
      }
    } catch (error) {
      console.error('Error toggling check-in/out:', error);
    }
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setLanguageDropdownOpen(false);
    // Here you would typically update the app's language context
    localStorage.setItem('selectedLanguage', language.code);
  };

  const handleCompanyChange = (company: Company) => {
    setCurrentCompany(company);
    setCompanyDropdownOpen(false);
    // Here you would typically update the app's company context
    localStorage.setItem('selectedCompany', company.id);
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      refetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      refetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleProfileNavigation = () => {
    setUserDropdownOpen(false);
    window.location.href = '/profile';
  };

  const handleSettingsNavigation = () => {
    window.location.href = '/settings';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (userProfile) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return 'Loading...';
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (userProfile?.profileImage) {
      return userProfile.profileImage;
    }
    return `https://ui-avatars.com/api/?name=${getUserDisplayName()}&background=6366f1&color=fff&size=32`;
  };

  return (
    <nav className="oh-navbar">
      <div className="oh-navbar-wrapper">
        <div className="oh-navbar-toggle-section">
          <button 
            className="oh-navbar-toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <ion-icon name="menu-outline"></ion-icon>
          </button>
        </div>

        <div className="oh-navbar-system-tray">
          {/* Clock In/Out Section */}
          <div className="oh-navbar-clock-in-out">
            <button 
              className={`oh-clock-in-btn ${isCheckedIn ? 'checked-in' : ''}`}
              onClick={handleCheckInOut}
              title={isCheckedIn ? 'Click to Check Out' : 'Click to Check In'}
            >
              <ion-icon name={isCheckedIn ? "log-out-outline" : "log-in-outline"}></ion-icon>
              <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
            </button>
          </div>

          {/* Companies Dropdown */}
          {companies && companies.length > 1 && (
            <div className="oh-navbar-companies" ref={companyDropdownRef}>
              <button 
                className="oh-companies-btn"
                onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                aria-label="Select company"
              >
                <ion-icon name="business-outline"></ion-icon>
                <span className="oh-companies-text">{currentCompany?.name || 'Company'}</span>
                <ion-icon name="chevron-down-outline" className="oh-dropdown-arrow"></ion-icon>
              </button>

              {companyDropdownOpen && (
                <div className="oh-companies-dropdown">
                  <div className="oh-dropdown-header">
                    <h3>Select Company</h3>
                  </div>
                  <div className="oh-dropdown-list">
                    {companies.map((company) => (
                      <button
                        key={company.id}
                        className={`oh-dropdown-item ${currentCompany?.id === company.id ? 'active' : ''}`}
                        onClick={() => handleCompanyChange(company)}
                      >
                        {company.logo && (
                          <img src={company.logo} alt={company.name} className="oh-company-logo" />
                        )}
                        <span>{company.name}</span>
                        {currentCompany?.id === company.id && (
                          <ion-icon name="checkmark-outline" className="oh-check-icon"></ion-icon>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Language Dropdown */}
          <div className="oh-navbar-language" ref={languageDropdownRef}>
            <button 
              className="oh-language-btn"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              aria-label="Select language"
            >
              <span className="oh-language-flag">{currentLanguage.flag}</span>
              <span className="oh-language-text">{currentLanguage.code.toUpperCase()}</span>
              <ion-icon name="chevron-down-outline" className="oh-dropdown-arrow"></ion-icon>
            </button>

            {languageDropdownOpen && (
              <div className="oh-language-dropdown">
                <div className="oh-dropdown-header">
                  <h3>Select Language</h3>
                </div>
                <div className="oh-dropdown-list">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      className={`oh-dropdown-item ${currentLanguage.code === language.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(language)}
                    >
                      <span className="oh-language-flag">{language.flag}</span>
                      <span>{language.name}</span>
                      {currentLanguage.code === language.code && (
                        <ion-icon name="checkmark-outline" className="oh-check-icon"></ion-icon>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="oh-navbar-notifications" ref={notificationRef}>
            <button 
              className="oh-notification-btn"
              onClick={() => setOpenNotification(!openNotification)}
              aria-label="Notifications"
            >
              <ion-icon name="notifications-outline"></ion-icon>
              {unreadCount > 0 && (
                <span className="oh-notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
              )}
            </button>

            {openNotification && (
              <div className="oh-notification-dropdown">
                <div className="oh-notification-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      className="oh-mark-all-read"
                      onClick={handleMarkAllRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="oh-notification-list">
                  {displayNotifications.length > 0 ? (
                    displayNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`oh-notification-item ${!notification.isRead ? 'unread' : ''} ${notification.type}`}
                        onClick={() => handleMarkNotificationRead(notification.id)}
                      >
                        <div className="oh-notification-icon">
                          <ion-icon name={notification.icon}></ion-icon>
                        </div>
                        <div className="oh-notification-content">
                          <p className="oh-notification-text">{notification.text}</p>
                          <span className="oh-notification-date">{notification.date}</span>
                        </div>
                        {!notification.isRead && <div className="oh-unread-indicator"></div>}
                      </div>
                    ))
                  ) : (
                    <div className="oh-no-notifications">
                      <ion-icon name="notifications-off-outline"></ion-icon>
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <div className="oh-notification-footer">
                  <button className="oh-view-all-btn">View All Notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="oh-navbar-settings">
            <button 
              className="oh-settings-btn" 
              onClick={handleSettingsNavigation}
              aria-label="Settings"
            >
              <ion-icon name="settings-outline"></ion-icon>
            </button>
          </div>

          {/* User Dropdown */}
          <div className="oh-navbar-user" ref={userDropdownRef}>
            <button 
              className="oh-user-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              aria-label="User menu"
            >
              <div className="oh-user-avatar">
                <img src={getUserAvatar()} alt="User Avatar" />
                {userLoading && <div className="oh-avatar-loading"></div>}
              </div>
              <div className="oh-user-info">
                <span className="oh-user-name">{getUserDisplayName()}</span>
                <span className="oh-user-role">{userProfile?.role || 'Employee'}</span>
              </div>
              <ion-icon name="chevron-down-outline"></ion-icon>
            </button>

            {userDropdownOpen && (
              <div className="oh-user-dropdown">
                <div className="oh-user-dropdown-header">
                  <div className="oh-user-dropdown-avatar">
                    <img src={getUserAvatar()} alt="User Avatar" />
                  </div>
                  <div className="oh-user-dropdown-info">
                    <h4>{getUserDisplayName()}</h4>
                    <p>{userProfile?.email || 'Loading...'}</p>
                    {userProfile?.department && (
                      <span className="oh-user-department">{userProfile.department}</span>
                    )}
                  </div>
                </div>
                <div className="oh-user-dropdown-menu">
                  <button className="oh-user-dropdown-item" onClick={handleProfileNavigation}>
                    <ion-icon name="person-outline"></ion-icon>
                    <span>My Profile</span>
                  </button>
                  <button 
                    className="oh-user-dropdown-item"
                    onClick={() => {
                      setShowChangeUsernameModal(true);
                      setUserDropdownOpen(false);
                    }}
                  >
                    <ion-icon name="create-outline"></ion-icon>
                    <span>Change Username</span>
                  </button>
                  <button 
                    className="oh-user-dropdown-item"
                    onClick={() => {
                      setShowChangePasswordModal(true);
                      setUserDropdownOpen(false);
                    }}
                  >
                    <ion-icon name="key-outline"></ion-icon>
                    <span>Change Password</span>
                  </button>
                  <hr className="oh-user-dropdown-divider" />
                  <button className="oh-user-dropdown-item oh-logout-item" onClick={handleLogout}>
                    <ion-icon name="log-out-outline"></ion-icon>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Username Modal */}
      {showChangeUsernameModal && (
        <div className="oh-modal-overlay" onClick={() => setShowChangeUsernameModal(false)}>
          <div className="oh-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="oh-modal-header">
              <h3>Change Username</h3>
              <button 
                className="oh-modal-close"
                onClick={() => setShowChangeUsernameModal(false)}
              >
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            <div className="oh-modal-body">
              <div className="oh-form-group">
                <label htmlFor="current-username">Current Username</label>
                <input 
                  type="text" 
                  id="current-username"
                  value={userProfile?.email || ''}
                  disabled
                />
              </div>
              <div className="oh-form-group">
                <label htmlFor="new-username">New Username</label>
                <input 
                  type="text" 
                  id="new-username"
                  placeholder="Enter new username"
                />
              </div>
            </div>
            <div className="oh-modal-footer">
              <button 
                className="oh-btn oh-btn-secondary"
                onClick={() => setShowChangeUsernameModal(false)}
              >
                Cancel
              </button>
              <button className="oh-btn oh-btn-primary">
                Update Username
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="oh-modal-overlay" onClick={() => setShowChangePasswordModal(false)}>
          <div className="oh-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="oh-modal-header">
              <h3>Change Password</h3>
              <button 
                className="oh-modal-close"
                onClick={() => setShowChangePasswordModal(false)}
              >
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            <div className="oh-modal-body">
              <div className="oh-form-group">
                <label htmlFor="current-password">Current Password</label>
                <input 
                  type="password" 
                  id="current-password"
                  placeholder="Enter current password"
                />
              </div>
              <div className="oh-form-group">
                <label htmlFor="new-password">New Password</label>
                <input 
                  type="password" 
                  id="new-password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="oh-form-group">
                <label htmlFor="confirm-password">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirm-password"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="oh-modal-footer">
              <button 
                className="oh-btn oh-btn-secondary"
                onClick={() => setShowChangePasswordModal(false)}
              >
                Cancel
              </button>
              <button className="oh-btn oh-btn-primary">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;