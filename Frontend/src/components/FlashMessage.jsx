import React, { useEffect } from 'react';

const FlashMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose();
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className={`flash-message ${type || 'info'}`} role="status" aria-live="polite">
      <span className="flash-icon">{type === 'success' ? '✓' : type === 'error' ? '✕' : 'i'}</span>
      <span className="flash-text">{message}</span>
    </div>
  );
};

export default FlashMessage;
