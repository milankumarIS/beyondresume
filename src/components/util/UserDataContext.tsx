// AppDataContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../../services/services";

type AppDataType = {
  userData: any;
  loading: boolean;
  error: string | null;
};

const AppDataContext = createContext<AppDataType>({
  userData: null,
  loading: true,
  error: null,
});

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProfile().then((result: any) => {
      const data = result?.data?.data;
      if (data?.userPersonalInfo || data?.userContact) {
        setUserData(data?.userPersonalInfo);
        // console.log(data);
      }
    });
  }, []);

  return (
    <AppDataContext.Provider value={{ userData, loading, error }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useUserData = () => useContext(AppDataContext);
