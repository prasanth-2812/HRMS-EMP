import React, { useState } from 'react';
import '../QuickAccess.css';

interface AssetRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const AssetRequestModal: React.FC<AssetRequestModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    assetType: '',
    assetName: '',
    brand: '',
    model: '',
    quantity: '1',
    priority: 'medium',
    requestedDate: '',
    requiredDate: '',
    purpose: '',
    specifications: '',
    estimatedCost: '',
    justification: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.assetType.trim()) {
      if (onSuccess) {
        onSuccess('Please select an asset type');
      }
      return;
    }
    
    if (!formData.assetName.trim()) {
      if (onSuccess) {
        onSuccess('Please enter an asset name');
      }
      return;
    }
    
    if (!formData.purpose.trim()) {
      if (onSuccess) {
        onSuccess('Please provide the purpose for this asset');
      }
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setFormData({
        assetType: '',
        assetName: '',
        brand: '',
        model: '',
        quantity: '1',
        priority: 'medium',
        requestedDate: '',
        requiredDate: '',
        purpose: '',
        specifications: '',
        estimatedCost: '',
        justification: ''
      });
      
      // Close modal
      onClose();
      
      // Show success notification
      if (onSuccess) {
        onSuccess('Asset request submitted successfully!');
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
      <div className="oh-create-asset-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h5 className="oh-modal-title">Create Asset Request</h5>
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
              <label className="oh-form-label" htmlFor="assetType">Asset Type *</label>
              <select
                id="assetType"
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                required
                className="oh-form-input"
              >
                <option value="">Select Asset Type</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop Computer</option>
                <option value="monitor">Monitor</option>
                <option value="keyboard">Keyboard</option>
                <option value="mouse">Mouse</option>
                  <option value="headset">Headset</option>
                  <option value="printer">Printer</option>
                  <option value="scanner">Scanner</option>
                  <option value="phone">Phone</option>
                  <option value="tablet">Tablet</option>
                  <option value="chair">Office Chair</option>
                  <option value="desk">Desk</option>
                  <option value="software">Software License</option>
                  <option value="other">Other</option>
                </select>
              </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="assetName">Asset Name *</label>
              <input
                type="text"
                id="assetName"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                required
                  className="oh-form-input"
                  placeholder="Enter asset name"
                />
              </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="brand">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="oh-form-input"
                placeholder="Enter brand name"
              />
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="oh-form-input"
                placeholder="Enter model number"
                />
              </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="oh-form-input"
                min="1"
                max="100"
              />
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="priority">Priority *</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="oh-form-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="estimatedCost">Estimated Cost</label>
              <input
                type="number"
                id="estimatedCost"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                className="oh-form-input"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="requestedDate">Requested Date *</label>
              <input
                type="date"
                id="requestedDate"
                name="requestedDate"
                value={formData.requestedDate}
                onChange={handleChange}
                required
                className="oh-form-input"
                />
              </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="requiredDate">Required By Date</label>
              <input
                type="date"
                id="requiredDate"
                name="requiredDate"
                value={formData.requiredDate}
                onChange={handleChange}
                className="oh-form-input"
              />
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="purpose">Purpose *</label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="oh-form-input"
              >
                <option value="">Select Purpose</option>
                <option value="new_employee">New Employee Setup</option>
                <option value="replacement">Replacement for Damaged/Old Asset</option>
                <option value="upgrade">Equipment Upgrade</option>
                <option value="additional">Additional Equipment Need</option>
                <option value="project">Project Requirement</option>
                <option value="remote_work">Remote Work Setup</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="specifications">Technical Specifications</label>
              <textarea
                id="specifications"
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                rows={3}
                className="oh-form-input"
                placeholder="Enter specific technical requirements or specifications..."
              />
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="justification">Business Justification *</label>
              <textarea
                id="justification"
                name="justification"
                value={formData.justification}
                onChange={handleChange}
                required
                rows={4}
                className="oh-form-input"
                placeholder="Please provide a detailed justification for this asset request..."
              />
            </div>
          </form>
        </div>

        <div className="oh-modal-footer">
          <button type="button" className="oh-btn oh-btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="oh-btn oh-btn--primary" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetRequestModal;
