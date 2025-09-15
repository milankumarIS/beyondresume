import React, { createContext, useContext, useState } from "react";

type IndustryContextType = {
  industryName: string | null;
  setIndustryName: (name: string | null) => void;
  spaceIndustryName: string | null;
  setSpaceIndustryName: (name: string | null) => void;
  industryLogo: string | null;
  setIndustryLogo: (logo: string | null) => void;
};

const IndustryContext = createContext<IndustryContextType>({
  industryName: null,
  setIndustryName: () => {},
  spaceIndustryName: null,
  setSpaceIndustryName: () => {},
  industryLogo: null,
  setIndustryLogo: () => {},
});

export const IndustryProvider = ({ children }: { children: React.ReactNode }) => {
  const [industryName, setIndustryNameState] = useState<string | null>(
    () => localStorage.getItem("industryName")
  );

  const [spaceIndustryName, setSpaceIndustryNameState] = useState<string | null>(
    () => localStorage.getItem("spaceIndustryName")
  );

  const [industryLogo, setIndustryLogoState] = useState<string | null>(
    () => localStorage.getItem("industryLogo")
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

  const setIndustryLogo = (logo: string | null) => {
    setIndustryLogoState(logo);
    if (logo) {
      localStorage.setItem("industryLogo", logo);
    } else {
      localStorage.removeItem("industryLogo");
    }
  };

  return (
    <IndustryContext.Provider
      value={{
        industryName,
        setIndustryName,
        spaceIndustryName,
        setSpaceIndustryName,
        industryLogo,
        setIndustryLogo,
      }}
    >
      {children}
    </IndustryContext.Provider>
  );
};

export const useIndustry = () => useContext(IndustryContext);
