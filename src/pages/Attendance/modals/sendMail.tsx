import React, { useState } from 'react';
import './sendMail.css';

interface SendMailProps {
  open: boolean;
  onClose: () => void;
  employee: { name: string; avatar: string };
}

const templates = ['----', 'Leave Reminder', 'Attendance Warning', 'General Notice'];

const SendMail: React.FC<SendMailProps> = ({ open, onClose, employee }) => {
  const [alsoSendTo, setAlsoSendTo] = useState('');
  const [subject, setSubject] = useState('Important Reminder');
  const [template, setTemplate] = useState(templates[0]);
  const [body, setBody] = useState('');
  const [templateAttachment, setTemplateAttachment] = useState(templates[0]);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  const [errors, setErrors] = useState({
    alsoSendTo: '',
    subject: '',
    template: '',
    body: '',
    templateAttachment: '',
  });

  if (!open) return null;

  const validateForm = () => {
    const newErrors = {
      alsoSendTo: alsoSendTo.trim() === '' ? 'Required' : '',
      subject: subject.trim() === '' ? 'Required' : '',
      template: template === '----' ? 'Select a template' : '',
      body: body.trim() === '' ? 'Required' : '',
      templateAttachment: templateAttachment === '----' ? 'Select an attachment' : '',
    };

    setErrors(newErrors);

    // Return true only if all errors are empty
    return Object.values(newErrors).every((err) => err === '');
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    alert('Please fill all the fields properly.');
    return;
  }

  alert('Mail sent!');
  onClose();
};


  return (
    <div className="sendmail-modal-overlay">
      <div className="sendmail-modal">
        <button className="sendmail-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="sendmail-title">Send Mail</h2>

        <div className="sendmail-employee-row">
          <div className="sendmail-avatar">{employee.avatar}</div>
          <div>
            <div className="sendmail-employee-name">{employee.name}</div>
            <div className="sendmail-employee-meta">None / None</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label className="sendmail-label">Also send to <span className="required">*</span></label>
          <textarea
            className="sendmail-input"
            value={alsoSendTo}
            onChange={(e) => setAlsoSendTo(e.target.value)}
            rows={2}
          />
          {errors.alsoSendTo && <div className="sendmail-error">{errors.alsoSendTo}</div>}

          <label className="sendmail-label">Subject <span className="required">*</span></label>
          <input
            className="sendmail-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Important Reminder"
          />
          {errors.subject && <div className="sendmail-error">{errors.subject}</div>}

          <label className="sendmail-label">Template <span className="required">*</span></label>
          <select
            className="sendmail-input"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            {templates.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.template && <div className="sendmail-error">{errors.template}</div>}

          <label className="sendmail-label">Message Body <span className="required">*</span></label>
          <div className="sendmail-tabs">
            <button
              type="button"
              className={tab === 'write' ? 'active' : ''}
              onClick={() => setTab('write')}
            >
              Write
            </button>
            <button
              type="button"
              className={tab === 'preview' ? 'active' : ''}
              onClick={() => setTab('preview')}
            >
              Preview
            </button>
          </div>

          {tab === 'write' ? (
            <textarea
              className="sendmail-bodyarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
            />
          ) : (
            <div className="sendmail-preview">
              {body || <span className="sendmail-preview-placeholder">Nothing to preview.</span>}
            </div>
          )}
          {errors.body && <div className="sendmail-error">{errors.body}</div>}

          <div className="sendmail-hint">
            Hint: Type {'{'}...{'}'} to get sender or receiver data
          </div>

          <label className="sendmail-label">Template as Attachment <span className="required">*</span></label>
          <select
            className="sendmail-input"
            value={templateAttachment}
            onChange={(e) => setTemplateAttachment(e.target.value)}
          >
            {templates.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.templateAttachment && <div className="sendmail-error">{errors.templateAttachment}</div>}

          <label className="sendmail-label">Other Attachments</label>
          <input
            className="sendmail-input"
            type="file"
            multiple
            onChange={(e) => setAttachments(e.target.files)}
          />

          <button
            className="sendmail-submit"
            type="submit"
          >
            Send Mail
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendMail;
