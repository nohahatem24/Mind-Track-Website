import React, { createContext, useContext, useState, ReactNode } from 'react';

export type InteractionMode = 'observe' | 'participate' | 'mindfulness' | 'self-soothe';

interface InteractionModeContextType {
  mode: InteractionMode | null;
  setMode: (mode: InteractionMode) => void;
}

const InteractionModeContext = createContext<InteractionModeContextType | undefined>(undefined);

export const InteractionModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<InteractionMode | null>(null);

  return (
    <InteractionModeContext.Provider value={{ mode, setMode }}>
      {children}
    </InteractionModeContext.Provider>
  );
};

export const useInteractionMode = () => {
  const context = useContext(InteractionModeContext);
  if (!context) {
    throw new Error('useInteractionMode must be used within InteractionModeProvider');
  }
  return context;
};
