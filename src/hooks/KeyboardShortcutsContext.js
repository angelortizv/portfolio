import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const KeyboardShortcutsContext = createContext({
  isOpen: false,
  openShortcuts: () => {},
  closeShortcuts: () => {},
});

export const KeyboardShortcutsProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openShortcuts = useCallback(() => setIsOpen(true), []);
  const closeShortcuts = useCallback(() => setIsOpen(false), []);

  return (
    <KeyboardShortcutsContext.Provider value={{ isOpen, openShortcuts, closeShortcuts }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
};

KeyboardShortcutsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useKeyboardShortcuts = () => useContext(KeyboardShortcutsContext);
