import React, { useState } from 'react';

interface RotatingShiftModalProps {
  onClose: () => void;
}

interface RotatingShift {
  id: number;
  title: string;
  shift1: string;
  shift2: string;
  additionalShifts: string;
}

const RotatingShiftModal: React.FC<RotatingShiftModalProps> = ({ onClose }) => {
  const [rotatingShifts, setRotatingShifts] = useState<RotatingShift[]>([
    {
      id: 1,
      title: 'Kathi Prasanth',
      shift1: 'Morning',
      shift2: 'Morning',
      additionalShifts: 'None'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRotatingShift, setNewRotatingShift] = useState({
    name: '',
    shift1: '',
    shift2: ''
  });

  const handleCreate = () => {
    if (newRotatingShift.name && newRotatingShift.shift1 && newRotatingShift.shift2) {
      const newShift: RotatingShift = {
        id: rotatingShifts.length + 1,
        title: newRotatingShift.name,
        shift1: newRotatingShift.shift1,
        shift2: newRotatingShift.shift2,
        additionalShifts: 'None'
      };
      setRotatingShifts([...rotatingShifts, newShift]);
      setNewRotatingShift({ name: '', shift1: '', shift2: '' });
      setShowCreateModal(false);
    }
  };

  const handleDelete = (id: number) => {
    setRotatingShifts(rotatingShifts.filter(shift => shift.id !== id));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewRotatingShift({ name: '', shift1: '', shift2: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRotatingShift(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px', width: '90%' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>Rotating Shift</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              + Create
            </button>
          </div>
          
          <div style={{ padding: '24px' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Title</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Shift 1</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Shift 2</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Additional Shifts</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rotatingShifts.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.title}</td>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.shift1}</td>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.shift2}</td>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.additionalShifts}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontSize: '16px'
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#ef4444',
                            fontSize: '16px'
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#374151' }}>Create Rotating Shift</h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={newRotatingShift.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Shift1 <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  name="shift1"
                  value={newRotatingShift.shift1}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">---Choose Shift---</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Shift2 <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  name="shift2"
                  value={newRotatingShift.shift2}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">---Choose Shift---</option>
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    color: '#10b981',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Add more shift..
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCreate}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RotatingShiftModal;
