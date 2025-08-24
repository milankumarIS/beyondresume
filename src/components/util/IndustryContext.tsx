import React, { createContext, useContext, useState } from "react";

type IndustryContextType = {
  industryName: string | null;
  setIndustryName: (name: string | null) => void;
  spaceIndustryName: string | null;
  setSpaceIndustryName: (name: string | null) => void;
};

const IndustryContext = createContext<IndustryContextType>({
  industryName: null,
  setIndustryName: () => {},
  spaceIndustryName: null,
  setSpaceIndustryName: () => {},
});

export const IndustryProvider = ({ children }: { children: React.ReactNode }) => {
  const [industryName, setIndustryNameState] = useState<string | null>(
    () => localStorage.getItem("industryName")
  );

  const [spaceIndustryName, setSpaceIndustryNameState] = useState<string | null>(
    () => localStorage.getItem("spaceIndustryName")
  );

  const setIndustryName = (name: string | null) => {
    setIndustryNameState(name);
    if (name) {
      localStorage.setItem("industryName", name);
    } else {
      localStorage.removeItem("industryName");
    }
  };

  const setSpaceIndustryName = (name: string | null) => {
    setSpaceIndustryNameState(name);
    if (name) {
      localStorage.setItem("spaceIndustryName", name);
    } else {
      localStorage.removeItem("spaceIndustryName");
    }
  };

  return (
    <IndustryContext.Provider
      value={{ industryName, setIndustryName, spaceIndustryName, setSpaceIndustryName }}
    >
      {children}
    </IndustryContext.Provider>
  );
};

export const useIndustry = () => useContext(IndustryContext);
