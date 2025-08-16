import React, { useState, useEffect } from 'react';
import { 
  getRotatingWorkTypes, 
  createRotatingWorkType, 
  updateRotatingWorkType, 
  deleteRotatingWorkType, 
  RotatingWorkType,
  getWorkTypes,
  WorkType
} from '../../../services/baseService';

interface RotatingWorkTypeModalProps {
  onClose: () => void;
}

const RotatingWorkTypeModal: React.FC<RotatingWorkTypeModalProps> = ({ onClose }) => {
  const [rotatingWorkTypes, setRotatingWorkTypes] = useState<RotatingWorkType[]>([]);
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRotatingWorkType, setNewRotatingWorkType] = useState({
    name: '',
    description: '',
    work_type_ids: [] as number[]
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingWorkTypeIds, setEditingWorkTypeIds] = useState<number[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchRotatingWorkTypes();
    fetchWorkTypes();
  }, []);

  const fetchRotatingWorkTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRotatingWorkTypes();
      setRotatingWorkTypes(response.results);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rotating work types');
      console.error('Error fetching rotating work types:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkTypes = async () => {
    try {
      const response = await getWorkTypes();
      setWorkTypes(response.results);
    } catch (err: any) {
      console.error('Error fetching work types:', err);
    }
  };

  const handleCreate = async () => {
    if (!newRotatingWorkType.name.trim() || newRotatingWorkType.work_type_ids.length === 0) {
      setError('Please provide a name and select at least one work type');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createRotatingWorkType({
        name: newRotatingWorkType.name,
        description: newRotatingWorkType.description,
        work_type_ids: newRotatingWorkType.work_type_ids
      });
      await fetchRotatingWorkTypes();
      setNewRotatingWorkType({ name: '', description: '', work_type_ids: [] });
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create rotating work type');
      console.error('Error creating rotating work type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rotatingWorkType: RotatingWorkType) => {
    setEditingId(rotatingWorkType.id!);
    setEditingValue(rotatingWorkType.name);
    setEditingDescription(rotatingWorkType.description || '');
    setEditingWorkTypeIds(rotatingWorkType.work_type_ids);
  };

  const handleSaveEdit = async () => {
    if (!editingValue.trim() || editingWorkTypeIds.length === 0) {
      setError('Please provide a name and select at least one work type');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await updateRotatingWorkType(editingId!, {
        name: editingValue,
        description: editingDescription,
        work_type_ids: editingWorkTypeIds
      });
      await fetchRotatingWorkTypes();
      setEditingId(null);
      setEditingValue('');
      setEditingDescription('');
      setEditingWorkTypeIds([]);
    } catch (err: any) {
      setError(err.message || 'Failed to update rotating work type');
      console.error('Error updating rotating work type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this rotating work type?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteRotatingWorkType(id);
      await fetchRotatingWorkTypes();
    } catch (err: any) {
      setError(err.message || 'Failed to delete rotating work type');
      console.error('Error deleting rotating work type:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewRotatingWorkType({ name: '', description: '', work_type_ids: [] });
    setError(null);
  };

  const getWorkTypeNames = (workTypeIds: number[]) => {
    return workTypeIds
      .map(id => workTypes.find(wt => wt.id === id)?.work_type)
      .filter(Boolean)
      .join(', ');
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
              disabled={loading}
              style={{
                backgroundColor: loading ? '#9ca3af' : '#ef4444',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
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
                marginBottom: '20px',
                fontSize: '14px'
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
                  }}>Description</th>
                  <th style={{
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: '600',
                    color: '#374151',
                    borderBottom: '1px solid #e2e8f0'
                  }}>Work Types</th>
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
                    <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                      Loading rotating work types...
                    </td>
                  </tr>
                ) : rotatingWorkTypes.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                      No rotating work types found
                    </td>
                  </tr>
                ) : (
                  rotatingWorkTypes.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
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
                          <input
                            type="text"
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '14px'
                            }}
                          />
                        ) : (
                          item.description || '-'
                        )}
                      </td>
                      <td style={{ padding: '16px', color: '#374151' }}>
                        {editingId === item.id ? (
                          <select
                            multiple
                            value={editingWorkTypeIds.map(String)}
                            onChange={(e) => {
                              const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                              setEditingWorkTypeIds(selectedIds);
                            }}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              fontSize: '14px',
                              minHeight: '80px'
                            }}
                          >
                            {workTypes.map(workType => (
                              <option key={workType.id} value={workType.id}>
                                {workType.work_type}
                              </option>
                            ))}
                          </select>
                        ) : (
                          getWorkTypeNames(item.work_type_ids)
                        )}
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
                                  color: loading ? '#9ca3af' : '#10b981',
                                  fontSize: '16px'
                                }}
                                title="Save"
                              >
                                ✅
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setEditingValue('');
                                  setEditingDescription('');
                                  setEditingWorkTypeIds([]);
                                }}
                                disabled={loading}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  color: loading ? '#9ca3af' : '#6b7280',
                                  fontSize: '16px'
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
                                  color: loading ? '#9ca3af' : '#6b7280',
                                  fontSize: '16px'
                                }}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(item.id!)}
                                disabled={loading}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: loading ? 'not-allowed' : 'pointer',
                                  color: loading ? '#9ca3af' : '#ef4444',
                                  fontSize: '16px'
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
              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '14px'
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
                  value={newRotatingWorkType.name}
                  onChange={(e) => setNewRotatingWorkType({ ...newRotatingWorkType, name: e.target.value })}
                  placeholder="Enter rotating work type name"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f3f4f6' : '#f9fafb',
                    cursor: loading ? 'not-allowed' : 'text'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Description</label>
                <textarea
                  value={newRotatingWorkType.description}
                  onChange={(e) => setNewRotatingWorkType({ ...newRotatingWorkType, description: e.target.value })}
                  placeholder="Enter description (optional)"
                  disabled={loading}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f3f4f6' : '#f9fafb',
                    cursor: loading ? 'not-allowed' : 'text',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>Work Types <span style={{ color: '#ef4444' }}>*</span></label>
                <select
                  multiple
                  value={newRotatingWorkType.work_type_ids.map(String)}
                  onChange={(e) => {
                    const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setNewRotatingWorkType({ ...newRotatingWorkType, work_type_ids: selectedIds });
                  }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f3f4f6' : 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    minHeight: '120px'
                  }}
                >
                  {workTypes.map(workType => (
                    <option key={workType.id} value={workType.id}>
                      {workType.work_type}
                    </option>
                  ))}
                </select>
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                  Hold Ctrl (Cmd on Mac) to select multiple work types
                </small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={handleCloseModal}
                  disabled={loading}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={loading || !newRotatingWorkType.name.trim() || newRotatingWorkType.work_type_ids.length === 0}
                  style={{
                    backgroundColor: (loading || !newRotatingWorkType.name.trim() || newRotatingWorkType.work_type_ids.length === 0) ? '#9ca3af' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: (loading || !newRotatingWorkType.name.trim() || newRotatingWorkType.work_type_ids.length === 0) ? 'not-allowed' : 'pointer'
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

export default RotatingWorkTypeModal;
