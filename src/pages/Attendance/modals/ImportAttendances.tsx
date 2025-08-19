import React, { useRef, useState } from 'react';
import './ImportAttendances.css';

const ImportAttendances: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleBoxClick = () => {
    inputRef.current?.click();
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    // Do upload logic here (e.g., send to backend)
    alert(`Uploaded: ${selectedFile.name}`);
    setSelectedFile(null);
    if(inputRef.current) inputRef.current.value = '';
  };

  return (
    <form className="import-attendances-form" onSubmit={handleUpload}>
      <h2 className="ia-title">Import Attendances</h2>
      <div
        className={`ia-upload-zone${dragActive ? ' ia-upload-zone--active' : ''}`}
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="ia-upload-content">
          <div className="ia-upload-icon">&#8682;</div>
          <div className="ia-upload-text">
            <strong>Upload a File</strong>
            <div className="ia-upload-desc">Drag and drop files here</div>
          </div>
        </div>
        <input
          type="file"
          ref={inputRef}
          className="ia-file-input"
          onChange={handleFileChange}
        />
      </div>
      <div className="ia-file-row">
        <label className="ia-choose-file-btn">
          Choose File
          <input
            type="file"
            onChange={handleFileChange}
            className="ia-choose-file-input"
          />
        </label>
        <span className="ia-file-name">
          {selectedFile ? selectedFile.name : "No file chosen"}
        </span>
      </div>
      <button type="submit" className="ia-upload-btn">Upload</button>
    </form>
  );
};

export default ImportAttendances;
