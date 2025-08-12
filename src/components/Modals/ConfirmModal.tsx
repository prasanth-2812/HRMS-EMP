import React from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3 className="confirm-modal-title">{title}</h3>
          <button 
            className="confirm-modal-close"
            onClick={onCancel}
            aria-label="Close"
          >
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="confirm-modal-body">
          <div className={`confirm-modal-icon confirm-modal-icon--${type}`}>
            <ion-icon 
              name={
                type === 'danger' ? 'warning-outline' :
                type === 'warning' ? 'alert-circle-outline' :
                'information-circle-outline'
              }
            ></ion-icon>
          </div>
          <p className="confirm-modal-message">{message}</p>
        </div>
        
        <div className="confirm-modal-footer">
          <button 
            className="btn btn--secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`btn btn--${type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'primary'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;