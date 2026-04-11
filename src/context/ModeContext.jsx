import React, { createContext, useContext, useState } from 'react';

// Teacher Mode PIN — enables answer visibility in unit pages for classroom use.
// This is separate from the actual teacher dashboard, which is protected by email identity.
// The PIN is a convenience feature for in-class projector sessions.
const _tp = ['1', '0', '5', '2', '9', '8'].join('');
const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Call this instead of directly toggling — it gates via PIN
  const requestTeacherMode = () => {
    if (isTeacherMode) {
      // Already on: turn off
      setIsTeacherMode(false);
    } else {
      setPinModalOpen(true);
      setPinInput('');
      setPinError('');
    }
  };

  const submitPin = () => {
    if (pinInput === _tp) {
      setIsTeacherMode(true);
      setPinModalOpen(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Incorrect PIN code. / Неверный PIN-код.');
    }
  };

  const cancelPin = () => {
    setPinModalOpen(false);
    setPinInput('');
    setPinError('');
  };

  const handlePinInput = (val) => {
    // digits only, max 6
    const digits = val.replace(/\D/g, '').slice(0, 6);
    setPinInput(digits);
    if (pinError) setPinError('');
  };

  return (
    <ModeContext.Provider value={{
      isTeacherMode,
      pinModalOpen,
      pinInput,
      pinError,
      requestTeacherMode,
      submitPin,
      cancelPin,
      handlePinInput,
    }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);