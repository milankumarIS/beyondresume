import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

type StatusKey = "PASS" | "FAIL" | "PENDING";


interface RoundContextType {
  activeRound: string | null;
  setActiveRound: (round: string | null) => void;
  activeStatus: StatusKey;
  setActiveStatus: (status: StatusKey) => void;
}

const RoundContext = createContext<RoundContextType | undefined>(undefined);

export const RoundProvider = ({ children }: { children: ReactNode }) => {
  const [activeRound, setActiveRound] = useState<string | null>('round-1');
  const [activeStatus, setActiveStatus] = useState<StatusKey>("PASS");

  const value = useMemo(
    () => ({ activeRound, setActiveRound, activeStatus, setActiveStatus }),
    [activeRound, activeStatus]
  );

  return <RoundContext.Provider value={value}>{children}</RoundContext.Provider>;
};

export const useRoundContext = () => {
  const context = useContext(RoundContext);
  if (!context) throw new Error("useRoundContext must be used within a RoundProvider");
  return context;
};
