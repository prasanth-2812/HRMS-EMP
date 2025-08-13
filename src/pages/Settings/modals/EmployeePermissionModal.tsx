import React, { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  role: string;
  avatar?: string;
}

interface EmployeePermissionModalProps {
  onClose: () => void;
}

const EmployeePermissionModal: React.FC<EmployeePermissionModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Mock employee data
  const employees: Employee[] = [
    { id: '1', name: 'Dileesh sai', employeeId: 'PEP0002', department: 'None', role: 'None' },
    { id: '2', name: 'Prasanth Kathi', employeeId: 'PEP0006', department: 'None', role: 'None' },
    { id: '3', name: 'Prasanth Kathi', employeeId: 'PEP0008', department: 'None', role: 'None' },
    { id: '4', name: 'Prasanth Kathi', employeeId: 'PEP0010', department: 'None', role: 'None' },
    { id: '5', name: 'Tarun', employeeId: 'PEP0007', department: 'None', role: 'None' },
    { id: '6', name: 'Tarun', employeeId: 'PEP0003', department: 'None', role: 'None' },
    { id: '7', name: 'uday kundan', employeeId: 'PEP0009', department: 'None', role: 'None' },
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = () => {
    console.log('Assigning permissions to:', selectedEmployee);
    setShowAssignModal(false);
    setSelectedEmployee(null);
  };

  if (showAssignModal && selectedEmployee) {
    return (
      <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
          <div className="modal-header">
            <h2>Assign Permissions</h2>
            <p>Assign permissions to {selectedEmployee.name} ({selectedEmployee.employeeId})</p>
            <button className="modal-close" onClick={() => setShowAssignModal(false)}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { key: 'recruitment', label: 'Recruitment', count: 0 },
                { key: 'leave', label: 'Leave', count: 0 },
                { key: 'pms', label: 'Pms', count: 0 },
                { key: 'onboarding', label: 'Onboarding', count: 0 },
                { key: 'asset', label: 'Asset', count: 0 },
                { key: 'attendance', label: 'Attendance', count: 0 },
                { key: 'payroll', label: 'Payroll', count: 0 },
                { key: 'biometric', label: 'Biometric', count: 0 },
                { key: 'helpdesk', label: 'Helpdesk', count: 0 },
                { key: 'offboarding', label: 'Offboarding', count: 0 },
                { key: 'project', label: 'Project', count: 0 }
              ].map((permission) => (
                <div key={permission.key} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <span style={{ fontWeight: '500' }}>{permission.label}</span>
                  <span style={{
                    backgroundColor: '#ff4757',
                    color: 'white',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {permission.count}
                  </span>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAssignSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', height: '80vh' }}>
        <div className="modal-header">
          <h2>Employee Permissions</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <ion-icon name="search-outline" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666',
                fontSize: '18px'
              }}></ion-icon>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
            <button 
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#ff6b6b',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '500'
              }}
            >
              <ion-icon name="add-outline"></ion-icon>
              Assign
            </button>
          </div>
          <button className="modal-close" onClick={onClose}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </div>
        
        <div className="modal-body" style={{ padding: '0', height: 'calc(100% - 120px)', overflow: 'auto' }}>
          <div style={{ padding: '20px' }}>
            {filteredEmployees.map((employee) => (
              <div key={employee.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '12px',
                backgroundColor: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    {employee.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
                      {employee.name} ({employee.employeeId})
                    </div>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      | {employee.department} | {employee.role}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleAssign(employee)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  <ion-icon name="chevron-down-outline"></ion-icon>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePermissionModal;