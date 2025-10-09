import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface JobContextType {
  selectedTab: number;
  setSelectedTab: (tab: number) => void;
  selectedJob: any | null;
  setSelectedJob: (job: any | null) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const value = useMemo(
    () => ({ selectedTab, setSelectedTab, selectedJob, setSelectedJob }),
    [selectedTab, selectedJob]
  );

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error("useJobContext must be used within a JobProvider");
  return context;
};
