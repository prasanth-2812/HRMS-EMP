import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // To get current path for dynamic title and navigation
import { useSidebar } from '../../contexts/SidebarContext'; // Use the hook instead of context directly
import './Navbar.css';

interface NavbarProps {
  // Pass current page title from the parent (e.g., AppRoutes or the Page component)
  pageTitle: string;
}

interface Notification {
  id: string;
  dotColor: string; // e.g., 'green'
  text: string;
  date: string;
  iconName: string; // Used for dynamic icon display
  read: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ pageTitle }) => {
  const navigate = useNavigate();
  const { toggleSidebar, isCollapsed } = useSidebar();

  // State for Notifications dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(true); // Controls content visibility for "Clear"
  const notificationRef = useRef<HTMLDivElement>(null); // Ref for click outside

  // State for Profile dropdown
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // State for Check-in/Check-out functionality
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null); // Ref for click outside

  // Mock Notification Data
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', dotColor: 'oh-navbar__notification-dot--green', text: 'Item has been deleted from the records.', date: 'Jan 03, 2023, at 11:13AM', iconName: 'trash-outline', read: false },
    { id: '2', dotColor: 'oh-navbar__notification-dot--green', text: 'Jane mentioned you in a post.', date: 'Jan 01, 2023, at 05:13PM', iconName: 'at-circle-outline', read: false },
    { id: '3', dotColor: 'oh-navbar__notification-dot--green', text: 'Aloyna share a document with you.', date: 'Dec 31, 2022, at 02:00PM', iconName: 'document-outline', read: false }, // Changed to document
    { id: '4', dotColor: 'oh-navbar__notification-dot--green', text: 'New event has been scheduled.', date: 'Dec 31, 2022, at 10:27AM', iconName: 'calendar-outline', read: false },
  ]);

  // Click outside handler for notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Click outside handler for profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = () => {
    setMarkAllAsRead(true);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotificationsVisible(false);
    // Optionally clear actual notifications state after animation
    setTimeout(() => setNotifications([]), 500); // Clear after a brief delay
  };

  const handleCheckInOut = () => {
    setIsCheckedIn(!isCheckedIn);
    // Here you can add additional logic like API calls to record attendance
    console.log(isCheckedIn ? 'Checked Out' : 'Checked In');
  };

  const getIonIcon = (name: string, classes: string = "") => {
    // This is a simplified representation. In a real app, you'd use a proper icon library
    // or load SVGs dynamically. For Ionicons specifically, you'd integrate their web components.
    // Here, I'll use common feather icons or general shapes.

    switch (name) {
      case 'enter-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><path d="M15 3h6v18h-6M10 17l5-5-5-5M13.8 12H3"></path></svg>;
      case 'exit-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16,17 21,12 16,7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
      case 'notifications-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
      case 'language-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
      case 'business-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><path d="M3 21h18"></path><path d="M5 21V7l8-4v18"></path><path d="M19 21V11l-6-4"></path></svg>;
      case 'checkmark-done-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><polyline points="18 15 22 19 22 4"></polyline><path d="M10 12L6 8l-2 2"></path><path d="M12 11L18 5"></path><path d="M6 18L2 14"></path></svg>;
      case 'close-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
      case 'trash-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
      case 'at-circle-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>;
      case 'document-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
      case 'calendar-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
      case 'settings-outline': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={classes}><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82-.33V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09z"></path></svg>;
      default: return null; // Fallback for unsupported icons
    }
  };

  // Logout function: clear storage and redirect
  const handleLogout = () => {
    // Clear tokens or user data as needed
    localStorage.clear();
    sessionStorage.clear();
    setShowProfileDropdown(false);
    window.location.replace('/login'); // Force reload and redirect
  };

  return (
    <nav className={`oh-navbar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="oh-wrapper">
        <div className="oh-navbar__toggle-container">
          <a href="#" className="oh-navbar__toggle-link" onClick={(e) => { e.preventDefault(); toggleSidebar(); }}>
            {/* Hamburger menu icon */}
            <svg className="oh-navbar__toggle-menu" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span className="oh-navbar__page-title">{pageTitle}</span>
          </a>
        </div>
        <div className="oh-navbar__systray">
          {/* CLOCK-IN/CLOCK-OUT Button */}
          <a href="#" className="oh-navbar__clock" onClick={(e) => { e.preventDefault(); handleCheckInOut(); }}>
            {getIonIcon(isCheckedIn ? 'exit-outline' : 'enter-outline', 'oh-navbar__clock-icon')}
            <span className="oh-navbar__clock-text">{isCheckedIn ? 'Check-Out' : 'Check-In'}</span>
          </a>

          <div className="oh-navbar__notifications" ref={notificationRef}>
            <a
              href="#"
              className="oh-navbar__notification-link"
              aria-label="Toggle Notifications"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                setShowNotifications(!showNotifications);
                setNotificationsVisible(true); // Reset visibility if opening
              }}
            >
              {getIonIcon('notifications-outline', 'oh-navbar__icon')}
              {notifications.filter(n => !n.read).length > 0 && notificationsVisible && (
                  <span className="oh-navbar__notification-badge">{notifications.filter(n => !n.read).length}</span>
              )}
            </a>
            {showNotifications && (
              <div className="oh-navbar__notification-tray">
                <div className="oh-navbar__notification-head">
                  <span className="oh-navbar__notification-head-title">Notifications</span>
                  {notificationsVisible && (
                    <div className="oh-navbar__notification-links">
                      {!markAllAsRead && notifications.length > 0 && (
                        <a href="#" className="oh-navbar__notification-tray-link mr-2" role="button" onClick={(e) => { e.preventDefault(); handleMarkAsRead(); }}>
                          {getIonIcon('checkmark-done-outline', 'mr-1')} Mark as read
                        </a>
                      )}
                      {notifications.length > 0 && (
                        <a href="#" className="oh-navbar__notification-tray-link oh-navbar__notification-tray-link--danger" role="button" onClick={(e) => { e.preventDefault(); handleClearNotifications(); }}>
                          {getIonIcon('close-outline', 'mr-1')} Clear
                        </a>
                      )}
                    </div>
                  )}
                </div>
                {notificationsVisible && notifications.length > 0 ? (
                  <div className="oh-navbar__notification-body">
                    <ul className="oh-navbar__nofication-list">
                      {notifications.map((notification) => (
                        <li key={notification.id} className="oh-navbar__notification-item">
                          <div>
                            <span className={`${notification.dotColor} ${notification.read ? '' : 'oh-navbar__notification-dot--unread'}`}></span>
                          </div>
                          <div>
                            <p className={`oh-navbar__notification-text ${notification.read ? '' : 'oh-navbar__notification-text--unread'}`}>
                              {notification.text}
                            </p>
                            <span className="oh-navbar__notification-date">{notification.date}</span>
                          </div>
                          <div>
                            <div className="oh-navbar__notification-image">
                              {/* Replaced ion-icon with getIonIcon for consistency */}
                              {getIonIcon(notification.iconName)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="oh-navbar__notification-empty">
                    <img src="/images/ui/happy.svg" alt="All caught up" width="50" height="50" loading="lazy" />
                    <span className="oh-navbar__notification-empty-title">All caught up!</span>
                    <span className="oh-navbar__notification-empty-desc">You have no new notifications at the moment.</span>
                  </div>
                )}
                {notificationsVisible && notifications.length > 0 && (
                  <div className="oh-navbar__notification-footer">
                    <a href="#" className="oh-navbar__notification-tray-link">View all comments</a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Language Icon */}
          <div className="oh-navbar__action-icons">
            <a href="#" className="oh-navbar__action-icons-link">
              {getIonIcon('language-outline', 'oh-navbar__icon')}
            </a>
          </div>

          {/* Companies Icon */}
          <div className="oh-navbar__action-icons">
            <a href="#" className="oh-navbar__action-icons-link">
              {getIonIcon('business-outline', 'oh-navbar__icon')}
            </a>
          </div>

          <div className="oh-navbar__action-icons">
            <a href="#" className="oh-navbar__action-icons-link">
              {getIonIcon('settings-outline', 'oh-navbar__icon')}
            </a>
          </div>

          <div className="oh-dropdown" ref={profileRef}>
            <div className="oh-navbar__user-info" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              <div className="oh-navbar__user-photo">
                <img src="/images/upload/userphoto.png" className="oh-navbar__user-image" loading="lazy" alt="User Photo" />
              </div>
              <span className="oh-navbar__user-name">Lizaveta Ivanovna</span>
            </div>
            {showProfileDropdown && (
              <div className="oh-dropdown__menu oh-dropdown__menu--right">
                <ul className="oh-dropdown__items">
                  <li className="oh-dropdown__item">
                    <a href="#" className="oh-dropdown__link" onClick={e => { e.preventDefault(); setShowProfileDropdown(false); navigate('/employee/profile'); }}>My Profile</a>
                  </li>
                  <li className="oh-dropdown__item">
                    <a href="#" className="oh-dropdown__link" onClick={e => { e.preventDefault(); setShowProfileDropdown(false); navigate('/company-info'); }}>Company Information</a>
                  </li>
                  <li className="oh-dropdown__item">
                    <a href="#" className="oh-dropdown__link" onClick={e => { e.preventDefault(); setShowProfileDropdown(false); navigate('/notifications'); }}>Notifications</a>
                  </li>
                  <li className="oh-dropdown__item">
                    <a href="#" className="oh-dropdown__link" onClick={e => { e.preventDefault(); setShowProfileDropdown(false); navigate('/employee/employees'); }}>Employees</a>
                  </li>
                </ul>
                <hr />
                <ul className="oh-dropdown__items">
                  <li className="oh-dropdown__item">
                    <a href="#" className="oh-dropdown__link" onClick={e => { e.preventDefault(); handleLogout(); }}>Log out</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;