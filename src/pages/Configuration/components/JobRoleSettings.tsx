import React, { useState } from 'react';
import JobRoleModal from '../../Settings/modals/JobRoleModal';

interface JobRoleSettingsProps {
  onClose?: () => void;
}

const JobRoleSettings: React.FC<JobRoleSettingsProps> = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="settings-content">
      <div className="settings-header">
        <h2>Job Role Settings</h2>
        <p>Manage job roles and their assignments</p>
        <button 
          className="btn btn-primary"
          onClick={handleOpenModal}
        >
          Manage Job Roles
        </button>
      </div>

      {showModal && (
        <JobRoleModal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default JobRoleSettings;