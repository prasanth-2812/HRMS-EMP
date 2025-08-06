import React, { useState } from 'react';
import '../QuickAccess.css';

interface DocumentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const DocumentRequestModal: React.FC<DocumentRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    documentType: '',
    purpose: '',
    urgency: 'medium',
    additionalInfo: '',
    deliveryMethod: 'email',
    deliveryAddress: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.documentType.trim()) {
      if (onSuccess) {
        onSuccess('Please select a document type');
      }
      return;
    }
    
    if (!formData.purpose.trim()) {
      if (onSuccess) {
        onSuccess('Please provide the purpose for this document');
      }
      return;
    }
    
    if (formData.deliveryMethod === 'mail' && !formData.deliveryAddress.trim()) {
      if (onSuccess) {
        onSuccess('Please provide a delivery address for mail delivery');
      }
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setFormData({
        documentType: '',
        purpose: '',
        urgency: 'medium',
        additionalInfo: '',
        deliveryMethod: 'email',
        deliveryAddress: ''
      });
      
      // Close modal
      onClose();
      
      // Show success notification
      if (onSuccess) {
        onSuccess('Document request submitted successfully!');
      }
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="oh-modal-overlay" onClick={onClose}>
      <div className="oh-create-document-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h5 className="oh-modal-title">Document Request</h5>
          <button 
            className="oh-modal-close" 
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="oh-modal-body">
          <form onSubmit={handleSubmit} className="oh-form-grid">
            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="documentType">Document Type *</label>
              <select
                id="documentType"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                required
                className="oh-form-input"
              >
                <option value="">Select Document Type</option>
                <option value="experience_certificate">Experience Certificate</option>
                <option value="salary_certificate">Salary Certificate</option>
                <option value="employment_letter">Employment Letter</option>
                <option value="relieving_letter">Relieving Letter</option>
                <option value="payslip">Payslip</option>
                <option value="tax_certificate">Tax Certificate</option>
                <option value="bank_letter">Bank Letter</option>
                <option value="character_certificate">Character Certificate</option>
                <option value="no_objection_certificate">No Objection Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="purpose">Purpose *</label>
              <input
                type="text"
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="oh-form-input"
                placeholder="e.g., Bank Loan, Job Application, Visa Processing"
              />
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="urgency">Urgency Level *</label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
                className="oh-form-input"
              >
                <option value="low">Low - Within 1 week</option>
                <option value="medium">Medium - Within 3 days</option>
                <option value="high">High - Within 24 hours</option>
              </select>
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="deliveryMethod">Delivery Method *</label>
              <select
                id="deliveryMethod"
                name="deliveryMethod"
                value={formData.deliveryMethod}
                onChange={handleChange}
                required
                className="oh-form-input"
              >
                <option value="email">Email</option>
                <option value="pickup">Office Pickup</option>
                <option value="post">Postal Mail</option>
                <option value="courier">Courier</option>
              </select>
            </div>

            {formData.deliveryMethod === 'email' && (
              <div className="oh-form-group">
                <label className="oh-form-label" htmlFor="deliveryAddress">Email Address *</label>
                <input
                  type="email"
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                  placeholder="Enter email address for document delivery"
                />
              </div>
            )}

            {(formData.deliveryMethod === 'post' || formData.deliveryMethod === 'courier') && (
              <div className="oh-form-group">
                <label className="oh-form-label" htmlFor="deliveryAddress">Delivery Address *</label>
                <textarea
                  id="deliveryAddress"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  required
                  className="oh-form-input"
                  rows={3}
                  placeholder="Enter complete delivery address"
                />
              </div>
            )}

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="additionalInfo">Additional Information</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                className="oh-form-input"
                rows={3}
                placeholder="Any specific requirements or additional details..."
              />
            </div>
          </form>
        </div>

        <div className="oh-modal-footer">
          <button
            type="button"
            className="oh-btn oh-btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="oh-btn oh-btn--primary"
            onClick={handleSubmit}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentRequestModal;
