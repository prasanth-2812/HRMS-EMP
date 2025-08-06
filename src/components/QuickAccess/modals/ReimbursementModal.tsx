import React, { useState } from 'react';
import '../QuickAccess.css';

interface ReimbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (message: string) => void;
}

const ReimbursementModal: React.FC<ReimbursementModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'reimbursement', // 'reimbursement' or 'leave_encashment'
    employeeId: '',
    amount: '',
    description: '',
    attachment: null as File | null,
    // Leave encashment specific fields
    leaveTypeId: '',
    cfdToEncash: '',
    adToEncash: ''
  });

  const [availableLeaves, setAvailableLeaves] = useState([
    { leaveType: 'Annual Leave', availableDays: 20, carryforwardDays: 5 },
    { leaveType: 'Sick Leave', availableDays: 12, carryforwardDays: 0 },
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.employeeId.trim()) {
      if (onSuccess) {
        onSuccess('Please select an employee');
      }
      return;
    }
    
    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      if (onSuccess) {
        onSuccess('Please enter a valid amount');
      }
      return;
    }
    
    if (!formData.description.trim()) {
      if (onSuccess) {
        onSuccess('Please provide a description');
      }
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Reset form
      setFormData({
        type: 'reimbursement',
        employeeId: '',
        amount: '',
        description: '',
        attachment: null,
        leaveTypeId: '',
        cfdToEncash: '',
        adToEncash: ''
      });
      
      // Close modal
      onClose();
      
      // Show success notification
      if (onSuccess) {
        onSuccess(formData.type === 'reimbursement' ? 'Reimbursement request submitted successfully!' : 'Leave encashment request submitted successfully!');
      }
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        attachment: e.target.files[0]
      });
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      type: e.target.value
    });
  };

  return (
    <div className="oh-modal-overlay" onClick={onClose}>
      <div className="oh-create-reimbursement-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oh-modal-header">
          <h5 className="oh-modal-title">
            {formData.type === 'reimbursement' ? 'Reimbursement Request' : 'Leave Encashment Request'}
          </h5>
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
              <label className="oh-form-label" htmlFor="type">Request Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
                required
                className="oh-form-input"
              >
                <option value="reimbursement">Reimbursement</option>
                <option value="leave_encashment">Leave Encashment</option>
              </select>
            </div>

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="employeeId">Employee *</label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="oh-form-input"
              >
                <option value="">Select Employee</option>
                <option value="current">Current User</option>
                {/* Add more employees as needed */}
              </select>
            </div>

            {formData.type === 'reimbursement' ? (
              <>
                <div className="oh-form-group">
                  <label className="oh-form-label" htmlFor="amount">Amount *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="oh-form-input"
                    placeholder="Enter reimbursement amount"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="oh-form-group">
                  <label className="oh-form-label" htmlFor="attachment">Attachment *</label>
                  <input
                    type="file"
                    id="attachment"
                    name="attachment"
                    onChange={handleFileChange}
                    required
                    className="oh-form-input"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  />
                  <small className="oh-form-help">
                    Upload receipts, invoices, or supporting documents
                  </small>
                </div>
              </>
            ) : (
              <>
                <div className="oh-form-group">
                  <label className="oh-form-label" htmlFor="leaveTypeId">Leave Type *</label>
                  <select
                    id="leaveTypeId"
                    name="leaveTypeId"
                    value={formData.leaveTypeId}
                    onChange={handleChange}
                    required
                    className="oh-form-input"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="annual">Annual Leave</option>
                    <option value="sick">Sick Leave</option>
                  </select>
                </div>

                <div className="oh-form-row">
                  <div className="oh-form-group">
                    <label className="oh-form-label" htmlFor="cfdToEncash">Carry Forward Days to Encash *</label>
                    <input
                      type="number"
                      id="cfdToEncash"
                      name="cfdToEncash"
                      value={formData.cfdToEncash}
                      onChange={handleChange}
                      required
                      className="oh-form-input"
                      min="0"
                      step="0.5"
                    />
                  </div>

                  <div className="oh-form-group">
                    <label className="oh-form-label" htmlFor="adToEncash">Available Days to Encash *</label>
                    <input
                      type="number"
                      id="adToEncash"
                      name="adToEncash"
                      value={formData.adToEncash}
                      onChange={handleChange}
                      required
                      className="oh-form-input"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>

                {/* Available Leave Table */}
                <div className="oh-form-group" id="availableTable">
                  <label className="oh-form-label">Available Leave Balance</label>
                  <table className="oh-table">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>Available Days</th>
                        <th>Carryforward Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableLeaves.map((leave, index) => (
                        <tr key={index}>
                          <td>{leave.leaveType}</td>
                          <td>{leave.availableDays}</td>
                          <td>{leave.carryforwardDays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            <div className="oh-form-group">
              <label className="oh-form-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="oh-form-input"
                placeholder="Enter description or additional details..."
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

export default ReimbursementModal;
