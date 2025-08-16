import React, { useState, useEffect } from 'react';
import { getRotatingShifts, createRotatingShift, updateRotatingShift, deleteRotatingShift, RotatingShift as ApiRotatingShift } from '../../../services/baseService';
import { getAllShifts, Shift } from '../../../services/shiftService';

interface RotatingShiftModalProps {
  onClose: () => void;
}

interface RotatingShiftData {
  id?: number;
  name: string;
  shift1: number;
  shift2: number;
  additional_shifts?: number[];
  shift1_name?: string;
  shift2_name?: string;
  additional_shifts_names?: string[];
}

const RotatingShiftModal: React.FC<RotatingShiftModalProps> = ({ onClose }) => {
  const [rotatingShifts, setRotatingShifts] = useState<RotatingShiftData[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<RotatingShiftData | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRotatingShift, setNewRotatingShift] = useState({
    name: '',
    shift1: 0,
    shift2: 0,
    additional_shifts: [] as number[]
  });

  // Fetch rotating shifts and shifts data
  useEffect(() => {
    fetchRotatingShifts();
    fetchShifts();
  }, []);

  const fetchRotatingShifts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRotatingShifts();
      const shiftsWithNames = response.results.map(shift => ({
        ...shift,
        shift1_name: getShiftName(shift.shift1),
        shift2_name: getShiftName(shift.shift2),
        additional_shifts_names: shift.additional_shifts?.map(id => getShiftName(id)) || []
      }));
      setRotatingShifts(shiftsWithNames);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rotating shifts');
      console.error('Error fetching rotating shifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShifts = async () => {
    try {
      const shiftsData = await getAllShifts();
      setShifts(shiftsData);
    } catch (err: any) {
      console.error('Error fetching shifts:', err);
    }
  };

  const getShiftName = (shiftId: number): string => {
    const shift = shifts.find(s => s.id === shiftId);
    return shift ? shift.shift : `Shift ${shiftId}`;
  };

  const handleCreate = async () => {
    if (!newRotatingShift.name || !newRotatingShift.shift1 || !newRotatingShift.shift2) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createRotatingShift({
        name: newRotatingShift.name,
        shift1: newRotatingShift.shift1,
        shift2: newRotatingShift.shift2,
        additional_shifts: newRotatingShift.additional_shifts
      });
      await fetchRotatingShifts();
      setNewRotatingShift({ name: '', shift1: 0, shift2: 0, additional_shifts: [] });
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create rotating shift');
      console.error('Error creating rotating shift:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this rotating shift?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteRotatingShift(id);
      await fetchRotatingShifts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete rotating shift');
      console.error('Error deleting rotating shift:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shift: RotatingShiftData) => {
    if (shift.id !== undefined) {
      setEditingId(shift.id);
      setEditingValue({ ...shift });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingValue || !editingId) return;

    try {
      setLoading(true);
      setError(null);
      await updateRotatingShift(editingId, {
        name: editingValue.name,
        shift1: editingValue.shift1,
        shift2: editingValue.shift2,
        additional_shifts: editingValue.additional_shifts
      });
      await fetchRotatingShifts();
      setEditingId(null);
      setEditingValue(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update rotating shift');
      console.error('Error updating rotating shift:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingValue(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewRotatingShift({ name: '', shift1: 0, shift2: 0, additional_shifts: [] });
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'shift1' || name === 'shift2') {
      setNewRotatingShift(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setNewRotatingShift(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditInputChange = (field: keyof RotatingShiftData, value: any) => {
    if (editingValue) {
      setEditingValue(prev => prev ? { ...prev, [field]: value } : null);
    }
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
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}
            
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
                  }}>Name</th>
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
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                      Loading...
                    </td>
                  </tr>
                ) : rotatingShifts.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                      No rotating shifts found
                    </td>
                  </tr>
                ) : (
                  rotatingShifts.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editingValue?.name || ''}
                            onChange={(e) => handleEditInputChange('name', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          />
                        ) : (
                          item.name
                        )}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <select
                            value={editingValue?.shift1 || 0}
                            onChange={(e) => handleEditInputChange('shift1', parseInt(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          >
                            <option value={0}>Select Shift</option>
                            {shifts.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.shift}
                              </option>
                            ))}
                          </select>
                        ) : (
                          item.shift1_name || `Shift ${item.shift1}`
                        )}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <select
                            value={editingValue?.shift2 || 0}
                            onChange={(e) => handleEditInputChange('shift2', parseInt(e.target.value))}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          >
                            <option value={0}>Select Shift</option>
                            {shifts.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.shift}
                              </option>
                            ))}
                          </select>
                        ) : (
                          item.shift2_name || `Shift ${item.shift2}`
                        )}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {item.additional_shifts_names?.join(', ') || 'None'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {editingId === item.id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                disabled={loading}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  color: '#10b981',
                                  fontSize: '16px',
                                  opacity: loading ? 0.5 : 1
                                }}
                                title="Save"
                              >
                                ✅
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={loading}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  color: '#6b7280',
                                  fontSize: '16px',
                                  opacity: loading ? 0.5 : 1
                                }}
                                title="Cancel"
                              >
                                ❌
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                disabled={loading}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  color: '#6b7280',
                                  fontSize: '16px',
                                  opacity: loading ? 0.5 : 1
                                }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => item.id !== undefined && handleDelete(item.id)}
                                disabled={loading || item.id === undefined}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: loading || item.id === undefined ? 'not-allowed' : 'pointer',
                                  color: '#ef4444',
                                  fontSize: '16px',
                                  opacity: loading || item.id === undefined ? 0.5 : 1
                                }}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}
              
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
                  placeholder="Enter rotating shift name"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    opacity: loading ? 0.6 : 1
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Shift 1 <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  name="shift1"
                  value={newRotatingShift.shift1}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  <option value={0}>Select Shift 1</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shift}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Shift 2 <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  name="shift2"
                  value={newRotatingShift.shift2}
                  onChange={handleInputChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  <option value={0}>Select Shift 2</option>
                  {shifts.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.shift}
                    </option>
                  ))}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={handleCloseModal}
                  disabled={loading}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !newRotatingShift.name || !newRotatingShift.shift1 || !newRotatingShift.shift2}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (loading || !newRotatingShift.name || !newRotatingShift.shift1 || !newRotatingShift.shift2) ? 'not-allowed' : 'pointer',
                    opacity: (loading || !newRotatingShift.name || !newRotatingShift.shift1 || !newRotatingShift.shift2) ? 0.6 : 1
                  }}
                >
                  {loading ? 'Creating...' : 'Create'}
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
