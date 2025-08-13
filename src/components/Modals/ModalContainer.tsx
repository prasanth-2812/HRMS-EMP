import React from 'react';

interface ModalContainerProps {
  children?: React.ReactNode;
}

const ModalContainer: React.FC<ModalContainerProps> = ({ children }) => {
  return (
    <div id="modal-container">
      {children}
    </div>
  );
};

export default ModalContainer;