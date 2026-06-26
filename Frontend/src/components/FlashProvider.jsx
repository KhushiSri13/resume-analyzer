import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import FlashMessage from './FlashMessage';

const FlashContext = createContext(null);

export const useFlash = () => {
  const context = useContext(FlashContext);

  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider');
  }

  return context;
};

export const FlashProvider = ({ children }) => {
  const [flash, setFlash] = useState(null);

  const showFlash = useCallback((message, type = 'info') => {
    setFlash({ message, type });
  }, []);

  const hideFlash = useCallback(() => {
    setFlash(null);
  }, []);

  const value = useMemo(() => ({ showFlash, hideFlash }), [showFlash, hideFlash]);

  return (
    <FlashContext.Provider value={value}>
      {children}
      {flash ? (
        <div className="flash-stack">
          <FlashMessage message={flash.message} type={flash.type} onClose={hideFlash} />
        </div>
      ) : null}
    </FlashContext.Provider>
  );
};
