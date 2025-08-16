import React, { useState } from 'react';

interface WorkTypeData {
  id: number;
  workType: string;
}

interface WorkTypeModalProps {
  onClose: () => void;
}

const WorkTypeModal: React.FC<WorkTypeModalProps> = ({ onClose }) => {
  const [workTypes, setWorkTypes] = useState<WorkTypeData[]>([
    { id: 1, workType: 'morning' },
    { id: 2, workType: 'Afternoon' }
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkType, setNewWorkType] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const companies = [
    'Prasanth Technologies',
    'Tech Corp',
    'Business Inc',
    'Innovation Ltd',
    'Global Solutions'
  ];

  const handleCreate = () => {
    if (newWorkType.trim()) {
      const newId = Math.max(...workTypes.map(wt => wt.id)) + 1;
      setWorkTypes([...workTypes, { id: newId, workType: newWorkType.trim() }]);
      setNewWorkType('');
      setSelectedCompany('');
      setShowCreateModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setNewWorkType('');
    setSelectedCompany('');
  };

  const handleEdit = (id: number, currentValue: string) => {
    setEditingId(id);
    setEditingValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim() && editingId) {
      setWorkTypes(workTypes.map(wt => 
        wt.id === editingId ? { ...wt, workType: editingValue.trim() } : wt
      ));
      setEditingId(null);
      setEditingValue('');
    }
  };

  const handleDelete = (id: number) => {
    setWorkTypes(workTypes.filter(wt => wt.id !== id));
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
           style={{
             padding: '10px 20px',
             backgroundColor: '#ef4444',
             color: '#ffffff',
             border: 'none',
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
                 }}>Work Type:</label>
                 <input
                   type="text"
                   value={newWorkType}
                   onChange={(e) => setNewWorkType(e.target.value)}
                   placeholder="Work Type"
                   style={{
                     width: '100%',
                     padding: '12px',
                     border: '1px solid #d1d5db',
                     borderRadius: '6px',
                     fontSize: '14px',
                     outline: 'none'
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
                   style={{
                     width: '100%',
                     padding: '12px',
                     border: '1px solid #d1d5db',
                     borderRadius: '6px',
                     fontSize: '14px',
                     outline: 'none',
                     backgroundColor: '#ffffff',
                     cursor: 'pointer'
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
                   style={{
                     padding: '10px 20px',
                     backgroundColor: '#ffffff',
                     color: '#6b7280',
                     border: '1px solid #d1d5db',
                     borderRadius: '6px',
                     fontSize: '14px',
                     cursor: 'pointer'
                   }}
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleCreate}
                   style={{
                     padding: '10px 20px',
                     backgroundColor: '#ef4444',
                     color: '#ffffff',
                     border: 'none',
                     borderRadius: '6px',
                     fontSize: '14px',
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
          gridTemplateColumns: '1fr auto',
          backgroundColor: '#f9fafb',
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151'
        }}>
          <div>Work Type</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        {workTypes.map((workType) => (
          <div key={workType.id} style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
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
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  autoFocus
                />
              ) : (
                workType.workType
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {editingId === workType.id ? (
                <>
                  <button
                    onClick={handleSaveEdit}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingValue('');
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#6b7280',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(workType.id, workType.workType)}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(workType.id)}
                    style={{
                      padding: '6px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
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