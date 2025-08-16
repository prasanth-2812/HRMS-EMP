import React, { useState, useEffect } from 'react';
import { getWorkTypes, createWorkType, updateWorkType, deleteWorkType, WorkType } from '../../../services/baseService';

interface WorkTypeModalProps {
  onClose: () => void;
}

const WorkTypeModal: React.FC<WorkTypeModalProps> = ({ onClose }) => {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkType, setNewWorkType] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const companies = [
    'Prasanth Technologies',
    'Tech Corp',
    'Business Inc',
    'Innovation Ltd',
    'Global Solutions'
  ];

  // Fetch work types on component mount
  useEffect(() => {
    fetchWorkTypes();
  }, []);

  const fetchWorkTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWorkTypes();
      setWorkTypes(response.results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch work types');
      console.error('Error fetching work types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (newWorkType.trim()) {
      try {
        setLoading(true);
        setError(null);
        await createWorkType({
          work_type: newWorkType.trim(),
          description: newDescription.trim() || undefined
        });
        await fetchWorkTypes(); // Refresh the list
        setNewWorkType('');
        setNewDescription('');
        setSelectedCompany('');
        setShowCreateModal(false);
      } catch (err: any) {
        setError(err.message || 'Failed to create work type');
        console.error('Error creating work type:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewWorkType('');
    setNewDescription('');
    setSelectedCompany('');
    setError(null);
  };

  const handleEdit = (id: number, currentValue: string) => {
    setEditingId(id);
    setEditingValue(currentValue);
  };

  const handleSaveEdit = async () => {
    if (editingValue.trim() && editingId) {
      try {
        setLoading(true);
        setError(null);
        await updateWorkType(editingId, {
          work_type: editingValue.trim()
        });
        await fetchWorkTypes(); // Refresh the list
        setEditingId(null);
        setEditingValue('');
      } catch (err: any) {
        setError(err.message || 'Failed to update work type');
        console.error('Error updating work type:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this work type?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteWorkType(id);
        await fetchWorkTypes(); // Refresh the list
      } catch (err: any) {
        setError(err.message || 'Failed to delete work type');
        console.error('Error deleting work type:', err);
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>Work Type</h1>
        <button
           onClick={() => setShowCreateModal(true)}
           disabled={loading}
           style={{
             padding: '10px 20px',
             backgroundColor: loading ? '#9ca3af' : '#ef4444',
             color: '#ffffff',
             border: 'none',
             borderRadius: '6px',
             fontSize: '14px',
             fontWeight: '500',
             cursor: loading ? 'not-allowed' : 'pointer',
             display: 'flex',
             alignItems: 'center',
             gap: '8px'
           }}
         >
           {loading ? 'Loading...' : '+ Create'}
         </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
          color: '#dc2626',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Create Modal */}
       {showCreateModal && (
         <div style={{
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           backgroundColor: 'rgba(0, 0, 0, 0.5)',
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           zIndex: 1000
         }}>
           <div style={{
             backgroundColor: '#ffffff',
             borderRadius: '8px',
             padding: '0',
             width: '500px',
             maxWidth: '90vw',
             boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
           }}>
             {/* Modal Header */}
             <div style={{
               padding: '20px 24px',
               borderBottom: '1px solid #e5e7eb',
               display: 'flex',
               justifyContent: 'space-between',
               alignItems: 'center'
             }}>
               <h2 style={{
                 fontSize: '18px',
                 fontWeight: '600',
                 color: '#374151',
                 margin: 0
               }}>Create Work Type</h2>
               <button
                 onClick={handleCloseModal}
                 style={{
                   background: 'none',
                   border: 'none',
                   fontSize: '24px',
                   cursor: 'pointer',
                   color: '#6b7280',
                   padding: '0',
                   width: '24px',
                   height: '24px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
                 }}
               >
                 ×
               </button>
             </div>

             {/* Modal Body */}
             <div style={{ padding: '24px' }}>
               <div style={{ marginBottom: '20px' }}>
                 <label style={{
                   display: 'block',
                   marginBottom: '8px',
                   fontSize: '14px',
                   fontWeight: '500',
                   color: '#374151'
                 }}>Work Type Name: *</label>
                 <input
                   type="text"
                   value={newWorkType}
                   onChange={(e) => setNewWorkType(e.target.value)}
                   placeholder="Enter work type name"
                   disabled={loading}
                   style={{
                     width: '100%',
                     padding: '12px',
                     border: '1px solid #d1d5db',
                     borderRadius: '6px',
                     fontSize: '14px',
                     outline: 'none',
                     backgroundColor: loading ? '#f9fafb' : '#ffffff'
                   }}
                 />
               </div>

               <div style={{ marginBottom: '20px' }}>
                 <label style={{
                   display: 'block',
                   marginBottom: '8px',
                   fontSize: '14px',
                   fontWeight: '500',
                   color: '#374151'
                 }}>Description:</label>
                 <textarea
                   value={newDescription}
                   onChange={(e) => setNewDescription(e.target.value)}
                   placeholder="Enter description (optional)"
                   disabled={loading}
                   rows={3}
                   style={{
                     width: '100%',
                     padding: '12px',
                     border: '1px solid #d1d5db',
                     borderRadius: '6px',
                     fontSize: '14px',
                     outline: 'none',
                     backgroundColor: loading ? '#f9fafb' : '#ffffff',
                     resize: 'vertical'
                   }}
                 />
               </div>

               <div style={{ marginBottom: '24px' }}>
                 <label style={{
                   display: 'block',
                   marginBottom: '8px',
                   fontSize: '14px',
                   fontWeight: '500',
                   color: '#374151'
                 }}>Company:</label>
                 <select
                   value={selectedCompany}
                   onChange={(e) => setSelectedCompany(e.target.value)}
                   disabled={loading}
                   style={{
                     width: '100%',
                     padding: '12px',
                     border: '1px solid #d1d5db',
                     borderRadius: '6px',
                     fontSize: '14px',
                     outline: 'none',
                     backgroundColor: loading ? '#f9fafb' : '#ffffff',
                     cursor: loading ? 'not-allowed' : 'pointer'
                   }}
                 >
                   <option value="">Select Company</option>
                   {companies.map(company => (
                     <option key={company} value={company}>
                       {company}
                     </option>
                   ))}
                 </select>
               </div>

               <div style={{
                 display: 'flex',
                 justifyContent: 'flex-end',
                 gap: '12px'
               }}>
                 <button
                   onClick={handleCloseModal}
                   disabled={loading}
                   style={{
                     padding: '10px 20px',
                     backgroundColor: '#ffffff',
                     color: '#6b7280',
                     border: '1px solid #d1d5db',
                     borderRadius: '6px',
                     fontSize: '14px',
                     cursor: loading ? 'not-allowed' : 'pointer'
                   }}
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleCreate}
                   disabled={loading || !newWorkType.trim()}
                   style={{
                     padding: '10px 20px',
                     backgroundColor: (loading || !newWorkType.trim()) ? '#9ca3af' : '#ef4444',
                     color: '#ffffff',
                     border: 'none',
                     borderRadius: '6px',
                     fontSize: '14px',
                     cursor: (loading || !newWorkType.trim()) ? 'not-allowed' : 'pointer'
                   }}
                 >
                   {loading ? 'Creating...' : 'Save'}
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}

      {/* Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr auto',
          backgroundColor: '#f9fafb',
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          <div>Work Type</div>
          <div>Description</div>
          <div>Actions</div>
        </div>

        {/* Loading State */}
        {loading && workTypes.length === 0 && (
          <div style={{
            padding: '40px 16px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Loading work types...
          </div>
        )}

        {/* Empty State */}
        {!loading && workTypes.length === 0 && (
          <div style={{
            padding: '40px 16px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            No work types found. Create your first work type.
          </div>
        )}

        {/* Table Body */}
        {workTypes.map((workType) => (
          <div key={workType.id} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr auto',
            padding: '12px 16px',
            borderBottom: '1px solid #f3f4f6',
            alignItems: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: '#374151'
            }}>
              {editingId === workType.id ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit();
                    }
                  }}
                  disabled={loading}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: loading ? '#f9fafb' : '#ffffff'
                  }}
                  autoFocus
                />
              ) : (
                workType.work_type
              )}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              paddingRight: '12px'
            }}>
              {workType.description || 'No description'}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {editingId === workType.id ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    disabled={loading || !editingValue.trim()}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: (loading || !editingValue.trim()) ? '#9ca3af' : '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: (loading || !editingValue.trim()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingValue('');
                    }}
                    disabled={loading}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: loading ? '#9ca3af' : '#6b7280',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => workType.id && handleEdit(workType.id, workType.work_type)}
                    disabled={loading || !workType.id}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      color: loading ? '#9ca3af' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => workType.id && handleDelete(workType.id)}
                    disabled={loading || !workType.id}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      color: loading ? '#9ca3af' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"></polyline>
                      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkTypeModal;