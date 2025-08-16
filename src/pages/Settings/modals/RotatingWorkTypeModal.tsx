import React, { useState } from 'react';

interface RotatingWorkType {
  id: number;
  title: string;
  workType1: string;
  workType2: string;
}

interface RotatingWorkTypeModalProps {
  onClose: () => void;
}

const RotatingWorkTypeModal: React.FC<RotatingWorkTypeModalProps> = ({ onClose }) => {
  const [rotatingWorkTypes, setRotatingWorkTypes] = useState<RotatingWorkType[]>([
    {
      id: 1,
      title: 'Kathi Prasanth',
      workType1: 'Afternoon',
      workType2: 'morning'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRotatingWorkType, setNewRotatingWorkType] = useState({
    name: '',
    workType1: '',
    workType2: ''
  });
  const [workTypeFields, setWorkTypeFields] = useState(2);

  const workTypeOptions = [
    'Morning',
    'Afternoon',
    'Evening',
    'Night',
    'Flexible'
  ];

  const handleCreate = () => {
    if (newRotatingWorkType.name.trim()) {
      const newItem: RotatingWorkType = {
        id: Date.now(),
        title: newRotatingWorkType.name,
        workType1: newRotatingWorkType.workType1,
        workType2: newRotatingWorkType.workType2
      };
      setRotatingWorkTypes([...rotatingWorkTypes, newItem]);
      setNewRotatingWorkType({ name: '', workType1: '', workType2: '' });
      setShowCreateModal(false);
      setWorkTypeFields(2);
    }
  };

  const handleDelete = (id: number) => {
    setRotatingWorkTypes(rotatingWorkTypes.filter(item => item.id !== id));
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewRotatingWorkType({ name: '', workType1: '', workType2: '' });
    setWorkTypeFields(2);
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
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>Rotating Work Type</h2>
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
                  }}>Work Type 1</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Work Type 2</th>
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
                {rotatingWorkTypes.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.title}</td>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.workType1}</td>
                    <td style={{ padding: '16px', color: '#374151' }}>{item.workType2}</td>
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
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#374151' }}>Create Rotating Work Type</h2>
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
                  value={newRotatingWorkType.name}
                  onChange={(e) => setNewRotatingWorkType({ ...newRotatingWorkType, name: e.target.value })}
                  placeholder="Name"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#f9fafb'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Work Type 1 <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={newRotatingWorkType.workType1}
                  onChange={(e) => setNewRotatingWorkType({ ...newRotatingWorkType, workType1: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">---Choose Work Type 1---</option>
                  {workTypeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Work Type 2 <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  value={newRotatingWorkType.workType2}
                  onChange={(e) => setNewRotatingWorkType({ ...newRotatingWorkType, workType2: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">---Choose Work Type 2---</option>
                  {workTypeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <button
                  onClick={() => setWorkTypeFields(workTypeFields + 1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#10b981',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Add more work types..
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

export default RotatingWorkTypeModal;
